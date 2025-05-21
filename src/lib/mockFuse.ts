// Mock implementation of fuse.js

interface FuseOptions<T> {
  keys?: Array<string | { name: string; weight: number }>;
  includeScore?: boolean;
  threshold?: number;
  ignoreLocation?: boolean;
  useExtendedSearch?: boolean;
}

interface FuseResult<T> {
  item: T;
  score?: number;
  refIndex?: number;
}

class Fuse<T> {
  private items: T[];
  private options: FuseOptions<T>;

  constructor(items: T[], options: FuseOptions<T> = {}) {
    this.items = items;
    this.options = {
      keys: [],
      includeScore: false,
      threshold: 0.6,
      ignoreLocation: false,
      useExtendedSearch: false,
      ...options
    };
    console.log('Using mock Fuse.js implementation');
  }

  search(pattern: string): Array<FuseResult<T>> {
    if (!pattern) {
      return this.items.map(item => ({ item }));
    }

    const searchPattern = pattern.toLowerCase();
    const results: Array<FuseResult<T>> = [];

    this.items.forEach((item, index) => {
      let match = false;
      let score = 1;

      // If no keys specified, try to match against the item directly if it's a string
      if (!this.options.keys || this.options.keys.length === 0) {
        if (typeof item === 'string') {
          match = item.toLowerCase().includes(searchPattern);
          score = match ? 0.5 : 1;
        }
      } else {
        // Search through each key
        for (const keyConfig of this.options.keys) {
          const keyName = typeof keyConfig === 'string' ? keyConfig : keyConfig.name;
          const weight = typeof keyConfig === 'object' ? keyConfig.weight : 1;
          
          // Access the property using the key
          const value = this.getProperty(item, keyName);
          
          if (value !== undefined) {
            if (typeof value === 'string' && value.toLowerCase().includes(searchPattern)) {
              match = true;
              score = Math.min(score, 0.3 / weight); // Lower score is better
            } else if (Array.isArray(value)) {
              // If the value is an array, check each element
              for (const element of value) {
                if (typeof element === 'string' && element.toLowerCase().includes(searchPattern)) {
                  match = true;
                  score = Math.min(score, 0.3 / weight);
                  break;
                }
              }
            }
          }
        }
      }

      if (match && score <= this.options.threshold!) {
        results.push({
          item,
          score: this.options.includeScore ? score : undefined,
          refIndex: index
        });
      }
    });

    // Sort results by score (lower is better)
    return results.sort((a, b) => {
      const scoreA = a.score ?? 1;
      const scoreB = b.score ?? 1;
      return scoreA - scoreB;
    });
  }

  private getProperty(obj: any, path: string): any {
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[part];
    }
    
    return current;
  }
}

export default Fuse;
