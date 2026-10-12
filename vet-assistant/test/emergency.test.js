import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isEmergency } from '../src/emergency.js';

test('détecte les urgences courantes, accents et majuscules compris', () => {
  for (const msg of [
    'Mon chien fait des convulsions',
    'mon chat ne respire plus bien',
    'Il a mangé du chocolat !',
    'Ma chienne a avalé de la mort-aux-rats',
    'Il saigne beaucoup de la patte',
    'Mon chat a été renversé par une voiture',
    'Le ventre de mon berger allemand est gonflé et dur',
    'Mon chat n\'urine plus depuis hier',
    'Mon chat n’urine plus depuis hier',
    'C\'est une URGENCE',
  ]) {
    assert.equal(isEmergency(msg), true, msg);
  }
});

test('ne déclenche pas sur les questions courantes', () => {
  for (const msg of [
    'Quels sont vos horaires ?',
    'Combien coûte un vaccin pour chat ?',
    'Je voudrais un rendez-vous pour une stérilisation',
    'Faites-vous les NAC ?',
  ]) {
    assert.equal(isEmergency(msg), false, msg);
  }
});
