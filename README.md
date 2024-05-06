# foto-album

### Felhőalapú elosztott rendszerek laboratórium
### Klenk Botond - FTNYN1

Az alkalmazást `express.js` segítségével készítettem, szerver oldali rendereléssel. A felhasználok és a hozzájuk tartozó session-öket `mongodb`-ben tárolom. A képek adatait (név, timestampm, url) is a mongodb-ben tárolom. Magukat a képeket `azure blob storage`-ba töltöm föl.

[Deployed App](https://pix-botondklenk-dev.apps.sandbox-m3.1530.p1.openshiftapps.com/)

### 4. Feladat

- [x] Openshift deploy
- [x] Felhasználó kezelés
- [ ] Képek kezelése

### 5. Feladat

- [X] Openshift deploy
- [X] Felhasználó kezelés
- [X] Képek kezelése
    - [X] Külön storage a képeknek (azure blob storage)
    - [X] Törlés (bejelentkezett felhasználóként - bárki törölheti bármelyik képet)
    - [X] Feltöltés (bejelentkezett felhasználóként)
    - [X] Rendezés (oszlopokra feljlécére kattintva)

### 6. Feladat (terv)

- [ ] Openshift deploy
- [ ] Felhasználó kezelés
- [ ] Képek kezelése
- [ ] A storge-ban serverless function futtatása egy tumblnail generálására