// Cover images from Open Library (openlibrary.org), stored in ./covers and bundled by the build.
import c12721865 from './covers/12721865.jpg';
import c11263774 from './covers/11263774.jpg';
// Books with no entry keep their pigment cover.
import c13301713 from './covers/13301713.jpg';
import c10527843 from './covers/10527843.jpg';
import c12468631 from './covers/12468631.jpg';
import c7281575 from './covers/7281575.jpg';
import c8739376 from './covers/8739376.jpg';
import c9315164 from './covers/9315164.jpg';
import c13116014 from './covers/13116014.jpg';
import c295773 from './covers/295773.jpg';
import c12216503 from './covers/12216503.jpg';
import c11481354 from './covers/11481354.jpg';
import c8314077 from './covers/8314077.jpg';
import c9278312 from './covers/9278312.jpg';
import c8303480 from './covers/8303480.jpg';
import c8793546 from './covers/8793546.jpg';
import c12356249 from './covers/12356249.jpg';
import c1472533 from './covers/1472533.jpg';
import c13322313 from './covers/13322313.jpg';
import c12307847 from './covers/12307847.jpg';
import c8235363 from './covers/8235363.jpg';
import c525391 from './covers/525391.jpg';
import c569477 from './covers/569477.jpg';
import c10648686 from './covers/10648686.jpg';
import c8775559 from './covers/8775559.jpg';
import c252882 from './covers/252882.jpg';
import c10544254 from './covers/10544254.jpg';
import c6397580 from './covers/6397580.jpg';
import c8369013 from './covers/8369013.jpg';
import c12567961 from './covers/12567961.jpg';
import c8044605 from './covers/8044605.jpg';
import c10226290 from './covers/10226290.jpg';
import c14348537 from './covers/14348537.jpg';
import c11200092 from './covers/11200092.jpg';
import c8634250 from './covers/8634250.jpg';
import c9278292 from './covers/9278292.jpg';
import c9286405 from './covers/9286405.jpg';
import c10507091 from './covers/10507091.jpg';
import c7369961 from './covers/7369961.jpg';
import c11196262 from './covers/11196262.jpg';
import c12393037 from './covers/12393037.jpg';
import c15267475 from './covers/15267475.jpg';
import c6979680 from './covers/6979680.jpg';
import c8133598 from './covers/8133598.jpg';
import c8771366 from './covers/8771366.jpg';
import c10590366 from './covers/10590366.jpg';
import c10618463 from './covers/10618463.jpg';
import c15013644 from './covers/15013644.jpg';
import c15023290 from './covers/15023290.jpg';
import c8758252 from './covers/8758252.jpg';
import c95742 from './covers/95742.jpg';
import c12622062 from './covers/12622062.jpg';
import c313084 from './covers/313084.jpg';
import c9009316 from './covers/9009316.jpg';
import c181493 from './covers/181493.jpg';
import c36314 from './covers/36314.jpg';
import c12859975 from './covers/12859975.jpg';
import c13859660 from './covers/13859660.jpg';
import c12818862 from './covers/12818862.jpg';

const COVERS: Record<string, string> = {
  "Les Misérables": c12721865,
  "The Brothers Karamazov": c11263774,
  "A Tale of Two Cities": c13301713,
  "Alice's Adventures in Wonderland": c10527843,
  "Babel": c12468631,
  "Braiding Sweetgrass": c7281575,
  "Circe": c8739376,
  "Convenience Store Woman": c9315164,
  "Crime and Punishment": c13116014,
  "Dr Jekyll and Mr Hyde": c295773,
  "Dracula": c12216503,
  "Dune": c11481354,
  "Educated": c8314077,
  "Emma": c9278312,
  "Ethan Frome": c8303480,
  "Exhalation": c8793546,
  "Frankenstein": c12356249,
  "Gilead": c1472533,
  "Great Expectations": c13322313,
  "Heart of Darkness": c12307847,
  "Jane Eyre": c8235363,
  "Jonathan Strange & Mr Norrell": c525391,
  "Kitchen": c569477,
  "Klara and the Sun": c10648686,
  "Little Women": c8775559,
  "Middlemarch": c252882,
  "Moby-Dick": c10544254,
  "Mrs Dalloway": c6397580,
  "My Ántonia": c8369013,
  "Northanger Abbey": c12567961,
  "Pachinko": c8044605,
  "Piranesi": c10226290,
  "Pride and Prejudice": c14348537,
  "Project Hail Mary": c11200092,
  "Sapiens": c8634250,
  "Sense and Sensibility": c9278292,
  "Silas Marner": c9286405,
  "Small Things Like These": c10507091,
  "Station Eleven": c7369961,
  "The Age of Innocence": c11196262,
  "The Call of the Wild": c12393037,
  "The Count of Monte Cristo": c15267475,
  "The Dispossessed": c6979680,
  "The Fifth Season": c8133598,
  "The Goldfinch": c8771366,
  "The Great Gatsby": c10590366,
  "The Left Hand of Darkness": c10618463,
  "The Master and Margarita": c15013644,
  "The Name of the Rose": c15023290,
  "The Overstory": c8758252,
  "The Remains of the Day": c95742,
  "The Secret Garden": c12622062,
  "The Tale of Genji": c313084,
  "The Time Machine": c9009316,
  "The Turn of the Screw": c181493,
  "The War of the Worlds": c36314,
  "Tomorrow, and Tomorrow, and Tomorrow": c12859975,
  "Treasure Island": c13859660,
  "Wuthering Heights": c12818862,
};
export const coverFor = (title: string) => COVERS[title];
