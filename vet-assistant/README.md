# 🐾 Assistant d'accueil IA pour cliniques vétérinaires

Un assistant virtuel qu'une clinique intègre sur son site **avec une seule ligne de code**.
Il répond 24h/24 aux questions courantes (horaires, tarifs, services), recueille les demandes de rendez-vous et redirige les urgences vers le téléphone de la clinique.

- **Widget web** (`public/widget.js`) : bulle de discussion. Ses styles sont isolés de ceux du site, et il fonctionne aussi sur mobile.
- **API** (`server.js`) : Node.js 20+ **sans aucune dépendance**. Les réponses viennent de Google Gemini.
- **Tableau de bord** (`/admin.html`) : nombre de conversations, demandes hors horaires, demandes de RDV, urgences et sujets les plus demandés. C'est la preuve de valeur à montrer à la clinique chaque mois.
- **Multi-cliniques** : un seul serveur, une fiche JSON par clinique.

## Garde-fous

| Risque | Protection |
|---|---|
| Urgence vitale | Détection par mots-clés **avant** l'appel à l'IA (`src/emergency.js`) : la réponse donne directement le téléphone, avec un bouton d'appel. L'IA peut aussi signaler une urgence en second filet. |
| Conseil médical | Le prompt interdit tout diagnostic, traitement ou posologie. L'assistant renvoie toujours vers un vétérinaire. |
| Informations inventées | L'assistant répond uniquement à partir de la fiche clinique. S'il ne sait pas, il donne le numéro de téléphone. |
| Panne de l'IA | Un message de secours donne le numéro de la clinique. |
| Abus | Limite de 40 messages par IP toutes les 5 min, messages de 1 000 caractères maximum, origines du site autorisées configurables par clinique. |
| RGPD | Les événements sont purgés après 90 jours. Seuls les 200 premiers caractères de chaque question sont stockés. |
| AI Act (transparence) | L'assistant indique qu'il est une IA, dans l'en-tête, la mention légale et ses réponses. |

## Démarrer en local

```bash
cd vet-assistant
cp .env.example .env      # puis renseigner GEMINI_API_KEY et ADMIN_TOKEN
npm start                 # http://localhost:3000
npm test
```

- `http://localhost:3000/` : faux site de clinique avec l'assistant, idéal pour filmer la démo.
- `http://localhost:3000/admin.html?clinic=demo` : tableau de bord, protégé par `ADMIN_TOKEN`.

**Sans `GEMINI_API_KEY`**, le serveur tourne en mode démo. Il répond par mots-clés (horaires, tarifs, FAQ) et détecte les urgences, mais ne prend pas les demandes de RDV.
Une clé gratuite s'obtient sur https://aistudio.google.com/apikey.

## Ajouter une clinique (environ 30 min par client)

1. Copier `clinics/demo.json` vers `clinics/<id>.json` (id en minuscules, chiffres et tirets).
2. Remplir les champs à partir du site de la clinique et d'un appel de 15 min avec l'accueil : horaires, `schedule` (horaires structurés), tarifs, FAQ, numéro d'urgence.
3. Mettre le domaine du site dans `allowedOrigins`, par exemple `["https://clinique-exemple.fr"]`.
4. Redémarrer le serveur, puis envoyer la ligne d'intégration au webmaster de la clinique :

```html
<script src="https://VOTRE-SERVEUR/widget.js" data-clinic="<id>" defer></script>
```

Cette ligne marche sur WordPress (bloc « HTML personnalisé »), Wix (« Code personnalisé ») et les sites faits à la main.

## Recevoir les demandes de RDV par email ou SMS

Renseigner `NOTIFY_WEBHOOK_URL` avec un webhook Make, Zapier ou n8n. À chaque demande complète, le serveur envoie :

```json
{ "type": "appointment_request", "clinicId": "demo", "clinicName": "...", "clinicEmail": "...",
  "ownerName": "...", "phone": "...", "petName": "...", "species": "...", "reason": "...", "preferredSlot": "..." }
```

Le scénario Make ou Zapier envoie ensuite un email à `clinicEmail`, ou un SMS à l'accueil.
Les demandes restent aussi visibles dans le tableau de bord.

## Déployer

Les données sont stockées dans des fichiers (`DATA_DIR`). Il faut donc un hébergement avec **disque persistant**.

- **Docker** (Railway, Fly.io, Render avec disque, un VPS) :
  ```bash
  docker build -t vet-assistant .
  docker run -p 3000:3000 -v vet-data:/data \
    -e GEMINI_API_KEY=... -e ADMIN_TOKEN=... vet-assistant
  ```
- Mettre le serveur derrière HTTPS : c'est obligatoire pour l'intégrer sur un site en https.

## Coûts de fonctionnement (ordre de grandeur, à vérifier sur la grille Gemini en vigueur)

Une clinique, c'est environ 300 à 1 000 messages par mois. Avec `gemini-2.5-flash-lite`, le coût d'IA reste de l'ordre de quelques euros par mois et par clinique. Un petit serveur coûte 5 à 10 €/mois pour toutes les cliniques. La marge sur l'abonnement à 149 €/mois dépasse donc 90 %.

## Prochaines étapes, quand il y aura plus de 5 cliniques

- Migrer le stockage vers Firestore ou Postgres (stack Firebase déjà utilisée dans Waggly).
- Envoyer un rapport hebdomadaire automatique par email à la clinique.
- Ajouter WhatsApp Business et Messenger comme canaux supplémentaires.
- Synchroniser avec l'agenda de la clinique pour proposer de vrais créneaux.
- Créer un back-office pour que la clinique modifie elle-même sa fiche.

## Structure

```
server.js            point d'entrée (HTTP, chargement .env, purge RGPD)
src/app.js           routes API, validation, CORS, limite de débit, fichiers statiques
src/prompt.js        prompt système et schéma de réponse JSON
src/llm.js           appel Gemini et mode démo
src/emergency.js     détection des urgences
src/hours.js         ouvert ou fermé (statistiques hors horaires)
src/store.js         stockage des événements et statistiques
src/clinics.js       chargement des fiches clinique
public/widget.js     widget à intégrer
public/demo.html     site de démonstration
public/admin.html    tableau de bord
clinics/*.json       une fiche par clinique
```
