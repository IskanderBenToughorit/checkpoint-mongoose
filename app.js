require('dotenv').config({ path: 'MONGO-URI.env' }); // Charger le fichier .env

const mongoose = require('mongoose');

// Vérifiez si l'URI est chargé correctement
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('Erreur : MONGO_URI n\'est pas défini dans MONGO-URI.env');
  process.exit(1); // Arrête le script si MONGO_URI est introuvable
}

// Connexion à la base de données
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  try{ console.log('Connexion réussie à la base de données checkpointMongoose')
  }catch{(err => console.error('Erreur de connexion à la base de données :', err))};


// Création du schéma
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String],
});

// Création du modèle basé sur le schéma
const Person = mongoose.model('Person', personSchema);

// Étape 1 : Ajouter une seule personne
const addSinglePerson = async () => {
  try {
    const singlePerson = new Person({ name: 'Alice', age: 28, favoriteFoods: ['Salad', 'Pizza'] });
    const savedPerson = await singlePerson.save();
    console.log('Personne ajoutée :', savedPerson);
  } catch (error) {
    console.error('Erreur lors de l’ajout d’une personne :', error);
  }
};
// Étape 2 : Ajouter plusieurs personnes
const addMultiplePersons = async () => {
  try {
    const personsArray = [
      { name: 'John', age: 35, favoriteFoods: ['Burger', 'Fries'] },
      { name: 'Jane', age: 30, favoriteFoods: ['Pasta', 'Ice cream'] },
      { name: 'Mike', age: 40, favoriteFoods: ['Steak', 'Wine'] },
    ];
    const savedPersons = await Person.create(personsArray);
    console.log('Personnes ajoutées :', savedPersons);
  } catch (error) {
    console.error('Erreur lors de l’ajout de plusieurs personnes :', error);
  }
};

// Étape 3 : Trouver toutes les personnes ayant un nom donné
const findByName = async (name) => {
  try {
    const persons = await Person.find({ name });
    console.log(`Personnes trouvées avec le nom "${name}" :`, persons);
  } catch (error) {
    console.error('Erreur lors de la recherche par nom :', error);
  }
};

// Étape 4 : Trouver une personne par aliment favori
const findByFavoriteFood = async (food) => {
  try {
    const person = await Person.findOne({ favoriteFoods: food });
    console.log(`Personne trouvée avec l'aliment "${food}" :`, person);
  } catch (error) {
    console.error('Erreur lors de la recherche par aliment favori :', error);
  }
};

// Étape 5 : Trouver une personne par ID
const findById = async (id) => {
  try {
    const person = await Person.findById(id);
    console.log('Personne trouvée par ID :', person);
  } catch (error) {
    console.error('Erreur lors de la recherche par ID :', error);
  }
};

// Étape 6 : Mettre à jour une personne
const updatePerson = async (id) => {
  try {
    const person = await Person.findById(id);
    if (person) {
      person.favoriteFoods.push('Hamburger');
      const updatedPerson = await person.save();
      console.log('Personne mise à jour :', updatedPerson);
    } else {
      console.log('Personne non trouvée pour la mise à jour');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error);
  }
};

// Étape 7 : Mise à jour avec findOneAndUpdate
const updateAge = async (name) => {
  try {
    const updatedPerson = await Person.findOneAndUpdate(
      { name },
      { age: 20 },
      { new: true } // Renvoie le document mis à jour
    );
    console.log('Personne mise à jour (age):', updatedPerson);
  } catch (error) {
    console.error('Erreur lors de la mise à jour avec findOneAndUpdate :', error);
  }
};

// Étape 8 : Supprimer une personne par ID
const deleteById = async (id) => {
  try {
    // Utilisation de findByIdAndDelete à la place de findByIdAndRemove
    const result = await Person.findByIdAndDelete(id);
    if (result) {
      console.log('Personne supprimée avec succès:', result);
    } else {
      console.log('Aucune personne trouvée avec cet ID');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression par ID :', error);
  }
};

// Étape 9 : Supprimer plusieurs personnes par nom
const deleteByName = async (name) => {
  try {
    const result = await Person.deleteMany({ name });
    console.log('Résultat de la suppression :', result);
  } catch (error) {
    console.error('Erreur lors de la suppression par nom :', error);
  }
};

// Étape 10 : Recherche avancée avec tri, limite et sélection
const advancedSearch = async () => {
  try {
    const results = await Person.find({ favoriteFoods: 'Fries' })
      .sort({ name: 1 }) // Trie par nom (ascendant)
      .limit(2) // Limite à 2 résultats
      .select('-age') // Exclut l'âge
      .exec();
    console.log('Résultats de la recherche avancée :', results);
  } catch (error) {
    console.error('Erreur lors de la recherche avancée :', error);
  }
};

// Exécution de toutes les étapes
const run = async () => {

  await addSinglePerson();
  await addMultiplePersons();
  await findByName('Alice');
  await findByFavoriteFood('Pizza');
  const id = '674f67246bbd02c0111c667f'; // Remplacez par un ID valide
  await findById(id);
  await updatePerson(id);
  await updateAge('John');
  await deleteById(id);
  await deleteByName('Jane');
 await advancedSearch();
 await mongoose.disconnect();
};

run();
