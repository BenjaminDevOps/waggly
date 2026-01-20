# Guide de Contribution - PetHealth

Merci de votre intérêt pour contribuer à PetHealth ! 🐾

## 📋 Code de Conduite

En participant à ce projet, vous acceptez de respecter notre code de conduite :
- Être respectueux et inclusif
- Accepter les critiques constructives
- Se concentrer sur ce qui est mieux pour la communauté

## 🚀 Comment Contribuer

### Signaler un Bug

1. Vérifiez que le bug n'a pas déjà été signalé dans [Issues](https://github.com/votre-username/pethealth/issues)
2. Créez une nouvelle issue avec le template "Bug Report"
3. Incluez :
   - Description claire du problème
   - Étapes pour reproduire
   - Comportement attendu vs actuel
   - Screenshots si applicable
   - Version de l'application et de l'OS

### Proposer une Fonctionnalité

1. Vérifiez que la fonctionnalité n'est pas déjà proposée
2. Créez une issue avec le template "Feature Request"
3. Décrivez :
   - Le problème que cela résout
   - La solution proposée
   - Les alternatives considérées

### Soumettre un Pull Request

#### 1. Fork et Clone

```bash
# Fork le repo sur GitHub, puis :
git clone https://github.com/votre-username/pethealth.git
cd pethealth
git remote add upstream https://github.com/original-owner/pethealth.git
```

#### 2. Créer une Branche

```bash
git checkout -b feature/nom-de-la-fonctionnalite
# ou
git checkout -b fix/nom-du-bug
```

Conventions de nommage :
- `feature/` : Nouvelles fonctionnalités
- `fix/` : Corrections de bugs
- `docs/` : Documentation
- `refactor/` : Refactoring
- `test/` : Tests
- `style/` : Changements de style/UI

#### 3. Développer

Installez les dépendances :
```bash
npm install
```

Configurez l'environnement :
```bash
cp .env.example .env
# Remplissez avec vos clés de développement
```

Lancez l'application :
```bash
npm start
```

#### 4. Respecter les Standards

##### Code Style
- TypeScript strict mode
- ESLint et Prettier (si configurés)
- Nommage clair et descriptif
- Commentaires pour la logique complexe

##### Structure des Composants
```typescript
// Imports
import { ... } from '...';

// Types/Interfaces
interface Props {
  ...
}

// Composant
export default function ComponentName({ props }: Props) {
  // Hooks
  const [state, setState] = useState();

  // Functions
  const handleAction = () => {
    ...
  };

  // Render
  return (
    ...
  );
}

// Styles
const styles = StyleSheet.create({
  ...
});
```

##### Commits
Suivez [Conventional Commits](https://www.conventionalcommits.org/) :

```
feat: ajouter le suivi des médicaments
fix: corriger le bug d'affichage des vaccinations
docs: mettre à jour le README
style: améliorer l'UI du diagnostic
refactor: optimiser le service Firestore
test: ajouter tests pour les rewards
```

#### 5. Tester

Avant de soumettre :
- [ ] L'application compile sans erreurs
- [ ] Toutes les fonctionnalités testées manuellement
- [ ] Pas de régression sur les fonctionnalités existantes
- [ ] Code formaté et lint passé
- [ ] Screenshots ajoutés pour les changements UI

#### 6. Commit et Push

```bash
git add .
git commit -m "feat: description de votre changement"
git push origin feature/nom-de-la-fonctionnalite
```

#### 7. Créer le Pull Request

1. Allez sur GitHub
2. Cliquez sur "New Pull Request"
3. Remplissez le template :
   - Description claire des changements
   - Issue(s) liée(s) (Closes #123)
   - Screenshots si applicable
   - Checklist complétée

## 🎯 Domaines de Contribution

### Priorité Haute
- 🐛 Corrections de bugs
- 📱 Amélioration de l'UX mobile
- 🌐 Internationalisation (i18n)
- ♿ Accessibilité
- 📝 Documentation

### Idées de Fonctionnalités
- Export PDF du carnet de santé
- Mode hors-ligne
- Reconnaissance d'image pour symptômes
- Intégration calendrier
- Partage sécurisé avec vétérinaires
- Support pour plus d'animaux (oiseaux, reptiles)

### Optimisations Techniques
- Performance et vitesse
- Réduction de la taille du bundle
- Gestion du cache
- Tests unitaires et d'intégration

## 📚 Ressources

### Documentation
- [React Native](https://reactnative.dev/docs/getting-started)
- [Expo](https://docs.expo.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Firebase](https://firebase.google.com/docs)

### Design
- Figma designs : [lien vers Figma]
- Charte graphique : Voir `DESIGN.md`
- Icons : [Expo Vector Icons](https://icons.expo.fyi/)

## 🤝 Processus de Review

1. Un mainteneur examinera votre PR dans les 48h
2. Des changements peuvent être demandés
3. Une fois approuvé, votre PR sera merged
4. Vous serez ajouté aux contributeurs ! 🎉

## ❓ Questions

Des questions ? N'hésitez pas à :
- Ouvrir une [Discussion](https://github.com/votre-username/pethealth/discussions)
- Contacter sur Twitter : [@pethealth](https://twitter.com/pethealth)
- Email : dev@pethealth.app

## 🏆 Contributeurs

Merci à tous nos contributeurs ! Votre nom apparaîtra ici.

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

---

**Merci de contribuer à PetHealth ! 🐾❤️**
