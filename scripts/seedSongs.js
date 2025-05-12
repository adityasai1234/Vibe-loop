// Script to seed songs data into Cobalt CMS
import { seedSongsToCobalt, sampleSongs } from '../src/services/cobaltService.js';

console.log('Starting to seed songs into Cobalt CMS...');
console.log(`Preparing to seed ${sampleSongs.length} songs`);

seedSongsToCobalt()
  .then(success => {
    if (success) {
      console.log(' Successfully seeded songs to Cobalt CMS!');
      console.log(`${sampleSongs.length} songs have been added to the collection.`);
    } else {
      console.error(' Failed to seed songs to Cobalt CMS.');
    }
  })
  .catch(error => {
    console.error(' Error seeding songs:', error);
  });