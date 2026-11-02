# Flânerie — Paris insolite

Prototype web du MLP de l’application de visites thématiques géolocalisées.

**Site :** https://am3su.github.io/flanerie/

## Le parcours utilisateur

1. **Accueil** : la promesse (« Voir ce que tout le monde regarde. Découvrir ce que personne ne voit. ») et, tout de suite, le choix **Ville · Langue · Parcours**.
2. **Composer ma visite**, en trois étapes :
   - **Ville** : Paris (Rome, Madrid et Londres arrivent bientôt) ;
   - **Langue** : celle du téléphone est présélectionnée. Huit langues : français, anglais, espagnol, italien, allemand, portugais (Brésil), chinois simplifié et arabe (affichage de droite à gauche) ;
   - **Parcours** : thème et format (2 heures, demi-journée à pied, journée à pied et en métro).
3. **Parcours** : vraie carte (style Plans sur iPhone, iPad et Mac, style Google Maps sur Android et ailleurs, réglable) avec le tracé piéton réel, les étapes insolites en rouge numérotées et les monuments en gris ; liste des étapes ; bouton « Démarrer le guide vocal ».
4. **Fiche lieu** : photos avec crédit TASL, texte, lecture audio, infos pratiques, « Se renseigner sur le tarif », itinéraire, copie de l’adresse, étape suivante.
5. **Guide vocal rue par rue** dans les huit langues (GPS ou marche simulée), itinéraires piétons OpenStreetMap.

## Structure

```
index.html                 application (HTML, CSS et JS dans un seul fichier)
sw.js                      service worker : fonctionnement hors ligne
manifest.webmanifest       installation sur l’écran d’accueil
content/catalog.json       catalogue : villes, thématiques, langues, parcours
content/{langue}/*.json    un fichier par parcours et par langue (format du CDC)
content/traces/*.geojson   tracé piéton réel de chaque parcours (OSRM, OpenStreetMap)
```

Chaque parcours est identifié par le triplet ville, thématique, langue. Les champs `parcours_id`, `statut` (gratuit/payant), `langue`, `ville`, `thematique` et `coordonnees` sont présents dès le MLP. Ajouter une ville, un thème ou une langue revient à ajouter des fichiers JSON, sans toucher au code.

## Cartes

Fond de carte OpenFreeMap (tuiles vectorielles OpenStreetMap, gratuites et sans clé), affiché avec MapLibre GL et recoloré façon Plans ou Google Maps selon l’appareil. Hors ligne ou sans WebGL, le plan dessiné prend le relais. Les boutons « Itinéraire » et « Ouvrir dans… » ouvrent l’application de cartes de l’appareil.

## Photos

Toutes les photos viennent de Wikimedia Commons, sous licences compatibles avec un usage commercial (CC BY, CC BY-SA, CC0 ou domaine public). La ligne de crédit TASL (titre, auteur, source, licence) est affichée sous chaque image. Les photos marquées `candidate` attendent la validation humaine (étape D du pipeline).

## Limites du prototype

- Les textes sont en attente du vérificateur factuel (mentions « à vérifier »).
- Les sept traductions (anglais, espagnol, italien, allemand, portugais, chinois, arabe) sont des versions de test, à reprendre une fois le français verrouillé, conformément au CDC.
- L’audio utilise la voix de synthèse du téléphone, en attendant les fichiers ElevenLabs.
