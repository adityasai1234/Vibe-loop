// Mock implementation of @cobalt-cms/client

interface Collection {
  name: string;
  fields: Array<{
    name: string;
    type: string;
    required: boolean;
  }>;
}

interface QueryOptions {
  query?: any;
  limit?: number;
  offset?: number;
  sort?: Record<string, number>;
  searchFields?: string[];
}

interface ClientOptions {
  projectId?: string;
  apiKey?: string;
}

// In-memory storage for mock data
let collections: Collection[] = [];
let documents: Record<string, any[]> = {};

// Create a mock client that mimics the behavior of @cobalt-cms/client
export function createClient(options: ClientOptions) {
  console.log('Using mock Cobalt CMS client');
  
  return {
    // Get all collections
    getCollections: async (): Promise<Collection[]> => {
      return collections;
    },
    
    // Create a new collection
    createCollection: async (collection: Collection): Promise<Collection> => {
      if (!collections.find(c => c.name === collection.name)) {
        collections.push(collection);
        documents[collection.name] = [];
      }
      return collection;
    },
    
    // Get documents from a collection with filtering and pagination
    getDocuments: async (collectionName: string, options: QueryOptions = {}) => {
      const { query = {}, limit = 20, offset = 0, sort } = options;
      
      if (!documents[collectionName]) {
        return { documents: [], total: 0 };
      }
      
      let filteredDocs = [...documents[collectionName]];
      
      // Apply search if provided
      if (query.search && options.searchFields) {
        const searchTerm = query.search.toLowerCase();
        filteredDocs = filteredDocs.filter(doc => {
          return options.searchFields!.some(field => {
            const value = doc[field];
            if (typeof value === 'string') {
              return value.toLowerCase().includes(searchTerm);
            } else if (Array.isArray(value)) {
              return value.some(v => typeof v === 'string' && v.toLowerCase().includes(searchTerm));
            }
            return false;
          });
        });
      }
      
      // Apply filters for specific fields
      Object.entries(query).forEach(([key, value]) => {
        if (key !== 'search' && key !== 'searchFields') {
          if (typeof value === 'object' && value !== null) {
            // Handle special operators like $containsAny
            if (value.$containsAny && Array.isArray(value.$containsAny)) {
              filteredDocs = filteredDocs.filter(doc => {
                const docValue = doc[key];
                if (Array.isArray(docValue)) {
                  return value.$containsAny.some((v: any) => docValue.includes(v));
                }
                return false;
              });
            } else {
              // Direct equality comparison
              filteredDocs = filteredDocs.filter(doc => doc[key] === value);
            }
          } else {
            // Direct equality comparison
            filteredDocs = filteredDocs.filter(doc => doc[key] === value);
          }
        }
      });
      
      // Apply sorting if provided
      if (sort) {
        const [sortField, sortDirection] = Object.entries(sort)[0];
        filteredDocs.sort((a, b) => {
          if (a[sortField] < b[sortField]) return sortDirection;
          if (a[sortField] > b[sortField]) return -sortDirection;
          return 0;
        });
      }
      
      // Apply pagination
      const paginatedDocs = filteredDocs.slice(offset, offset + limit);
      
      return {
        documents: paginatedDocs,
        total: filteredDocs.length
      };
    },
    
    // Create a new document in a collection
    createDocument: async (collectionName: string, document: any): Promise<any> => {
      if (!documents[collectionName]) {
        documents[collectionName] = [];
      }
      
      // Check if document with same ID already exists
      const existingIndex = documents[collectionName].findIndex(doc => doc.id === document.id);
      if (existingIndex >= 0) {
        // Update existing document
        documents[collectionName][existingIndex] = { ...document };
        return documents[collectionName][existingIndex];
      } else {
        // Add new document
        documents[collectionName].push({ ...document });
        return document;
      }
    },
    
    // Update an existing document
    updateDocument: async (collectionName: string, documentId: string, updates: any): Promise<any> => {
      if (!documents[collectionName]) {
        throw new Error(`Collection ${collectionName} not found`);
      }
      
      const docIndex = documents[collectionName].findIndex(doc => doc.id === documentId);
      if (docIndex === -1) {
        throw new Error(`Document with ID ${documentId} not found`);
      }
      
      documents[collectionName][docIndex] = {
        ...documents[collectionName][docIndex],
        ...updates
      };
      
      return documents[collectionName][docIndex];
    },
    
    // Delete a document
    deleteDocument: async (collectionName: string, documentId: string): Promise<boolean> => {
      if (!documents[collectionName]) {
        return false;
      }
      
      const initialLength = documents[collectionName].length;
      documents[collectionName] = documents[collectionName].filter(doc => doc.id !== documentId);
      
      return documents[collectionName].length < initialLength;
    }
  };
}