#!/usr/bin/env python3
"""
Test script for S3 song upload and listing operations
This script mimics the same operations that the Next.js app performs
"""

import boto3
import json
import time
from datetime import datetime
from botocore.exceptions import ClientError

# S3 Configuration (matching the .env file)
S3_ENDPOINT = "https://serenidad.hel1.your-objectstorage.com"
S3_REGION = "eu-central-1"
S3_ACCESS_KEY_ID = "1BY6DNARWDPSQT4DXA18"
S3_SECRET_ACCESS_KEY = "ieGy5o6biNPCc09iKbE55sPe01JywW8u5pFpnk8J"
S3_BUCKET_NAME = "serenidad"
S3_FORCE_PATH_STYLE = False


def create_s3_client():
    """Create and return S3 client with our configuration"""
    try:
        from botocore.config import Config
        
        s3_client = boto3.client(
            's3',
            endpoint_url=S3_ENDPOINT,
            region_name=S3_REGION,
            aws_access_key_id=S3_ACCESS_KEY_ID,
            aws_secret_access_key=S3_SECRET_ACCESS_KEY,
            config=Config(
                s3={'addressing_style': 'virtual'},
                signature_version='s3v4'
            )
        )
        print("✅ S3 client created successfully")
        return s3_client
    except Exception as e:
        print(f"❌ Failed to create S3 client: {e}")
        return None


def generate_song_id():
    """Generate a unique song ID"""
    timestamp = int(time.time() * 1000)
    random_part = str(int(time.time() * 1000000))[-9:]
    return f"song_{timestamp}_{random_part}"


def upload_test_song(s3_client, song_id, title, artist):
    """Upload a test audio file and its metadata"""
    try:
        # Create fake audio content (in real app this would be actual audio file)
        audio_content = f"This is fake audio content for {title} by {artist}".encode('utf-8')
        
        # Upload audio file
        audio_key = f"audio/{song_id}.mp3"
        print(f"📤 Uploading audio file: {audio_key}")
        
        response = s3_client.put_object(
            Bucket=S3_BUCKET_NAME,
            Key=audio_key,
            Body=audio_content,
            ContentType='audio/mpeg'
        )
        
        # Check the response
        if response['ResponseMetadata']['HTTPStatusCode'] != 200:
            print(f"⚠️  Upload returned status: {response['ResponseMetadata']['HTTPStatusCode']}")
        
        # Verify the object exists immediately after upload
        try:
            s3_client.head_object(Bucket=S3_BUCKET_NAME, Key=audio_key)
            print("✅ Verified: Audio file exists after upload")
        except ClientError:
            print("❌ Audio file NOT found after upload!")
        
        # Create and upload metadata
        metadata = {
            "title": title,
            "artist": artist,
            "likes": 0,
            "uploadedAt": datetime.now().isoformat()
        }
        
        metadata_key = f"metadata/{song_id}.json"
        print(f"📝 Uploading metadata: {metadata_key}")
        
        s3_client.put_object(
            Bucket=S3_BUCKET_NAME,
            Key=metadata_key,
            Body=json.dumps(metadata),
            ContentType='application/json'
        )
        print("✅ Metadata uploaded successfully")
        
        return song_id
        
    except ClientError as e:
        print(f"❌ Error uploading song: {e}")
        return None


def list_all_songs(s3_client):
    """List all songs from the S3 bucket"""
    try:
        print("\n🔍 Listing all objects in bucket...")
        
        # List all objects in bucket
        response = s3_client.list_objects_v2(Bucket=S3_BUCKET_NAME)
        
        if 'Contents' not in response:
            print("📭 Bucket is empty")
            return []
        
        all_objects = response['Contents']
        print(f"📁 Found {len(all_objects)} total objects:")
        for obj in all_objects:
            print(f"  - {obj['Key']} ({obj['Size']} bytes)")
        
        # List metadata files specifically
        print("\n🎵 Looking for songs (metadata files)...")
        
        metadata_response = s3_client.list_objects_v2(
            Bucket=S3_BUCKET_NAME,
            Prefix='metadata/'
        )
        
        if 'Contents' not in metadata_response:
            print("📭 No songs found (no metadata files)")
            return []
        
        songs = []
        metadata_objects = metadata_response['Contents']
        print(f"📝 Found {len(metadata_objects)} metadata files:")
        
        for obj in metadata_objects:
            if obj['Key'].endswith('.json'):
                print(f"  - {obj['Key']}")
                
                # Extract song ID from key
                song_id = obj['Key'].replace('metadata/', '').replace('.json', '')
                
                try:
                    # Get metadata content
                    metadata_obj = s3_client.get_object(Bucket=S3_BUCKET_NAME, Key=obj['Key'])
                    metadata_content = metadata_obj['Body'].read().decode('utf-8')
                    metadata = json.loads(metadata_content)
                    
                    # Generate signed URL for audio
                    audio_key = f"audio/{song_id}.mp3"
                    audio_url = s3_client.generate_presigned_url(
                        'get_object',
                        Params={'Bucket': S3_BUCKET_NAME, 'Key': audio_key},
                        ExpiresIn=3600
                    )
                    
                    song = {
                        'id': song_id,
                        'title': metadata['title'],
                        'artist': metadata['artist'],
                        'likes': metadata['likes'],
                        'uploadedAt': metadata['uploadedAt'],
                        'audioUrl': audio_url
                    }
                    
                    songs.append(song)
                    print(f"    ✅ Processed: {metadata['title']} by {metadata['artist']}")
                    
                except Exception as e:
                    print(f"    ❌ Error processing {obj['Key']}: {e}")
        
        print(f"\n🎶 Total songs found: {len(songs)}")
        return songs
        
    except ClientError as e:
        print(f"❌ Error listing songs: {e}")
        if e.response['Error']['Code'] == 'NoSuchKey':
            print("🔍 This suggests the bucket exists but is empty or the prefix doesn't exist")
        return []


def test_bucket_access(s3_client):
    """Test basic bucket access"""
    try:
        print(f"\n🧪 Testing bucket access for: {S3_BUCKET_NAME}")
        
        # Try to head the bucket (check if it exists and we have access)
        s3_client.head_bucket(Bucket=S3_BUCKET_NAME)
        print("✅ Bucket exists and is accessible")
        
        # Try a simple list operation
        response = s3_client.list_objects_v2(Bucket=S3_BUCKET_NAME, MaxKeys=1)
        print("✅ List operation successful")
        
        return True
        
    except ClientError as e:
        error_code = e.response['Error']['Code']
        print(f"❌ Bucket access test failed: {error_code} - {e}")
        
        if error_code == 'NoSuchBucket':
            print("🔍 The bucket doesn't exist")
        elif error_code == 'Forbidden':
            print("🔍 Access denied - check credentials and permissions")
        elif error_code == 'NoSuchKey':
            print("🔍 Bucket exists but may be empty")
            
        return False


def main():
    print("🎵 VibeLoop S3 Song Operations Test")
    print("=" * 50)
    
    # Create S3 client
    s3_client = create_s3_client()
    if not s3_client:
        return
    
    # Test bucket access
    if not test_bucket_access(s3_client):
        print("\n⚠️  Bucket access failed. Please check your configuration.")
        return
    
    # List existing songs
    print("\n1️⃣ Listing existing songs...")
    existing_songs = list_all_songs(s3_client)
    
    if existing_songs:
        print("\n🎵 Existing songs in library:")
        for song in existing_songs:
            print(f"  - {song['title']} by {song['artist']} (ID: {song['id']})")
    
    # Upload a test song
    print("\n2️⃣ Uploading a test song...")
    test_song_id = generate_song_id()
    uploaded_id = upload_test_song(
        s3_client, 
        test_song_id, 
        "Python Test Song", 
        "S3 Test Artist"
    )
    
    if uploaded_id:
        print(f"✅ Test song uploaded with ID: {uploaded_id}")
        
        # List songs again to verify
        print("\n3️⃣ Listing songs after upload...")
        updated_songs = list_all_songs(s3_client)
        
        print("\n📊 Summary:")
        print(f"  - Songs before: {len(existing_songs)}")
        print(f"  - Songs after: {len(updated_songs)}")
        print(f"  - New songs added: {len(updated_songs) - len(existing_songs)}")
        
        if len(updated_songs) > len(existing_songs):
            print("🎉 Upload and listing working correctly!")
        else:
            print("⚠️  Song may not have been uploaded correctly")
    else:
        print("❌ Failed to upload test song")


if __name__ == "__main__":
    main() 