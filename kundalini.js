Players = new Meteor.Collection('players');
Codices = new Meteor.Collection('codices');
Cards = new Meteor.Collection('cards');
Zones = new Meteor.Collection('zones');
Fields = new Meteor.Collection('fields');

if (Meteor.isClient) {

  Template.game.field = function() {
    return Fields.findOne({});
  };

  $(document).on('click', "[id*='roll']", function() {
    var $id = $(this).attr('id').split('_')[0],
        roll = Math.floor((Math.random()*10)+1);

    if (roll < 10) {
      Players.update({_id: $id}, {$set: {resonance: Math.ceil(roll)}});
    }
    else {
      Players.update({_id: $id}, {$set: {resonance: 5}, $inc: {harmony: -1}});
    }
  });

  $(document).on('click', "[id*='reset']", function() {
    var $id = $(this).attr('id').split('_')[0];

    Players.update({_id: $id}, {$set: {essence: 10, resonance: 0, harmony: 0, discord: 0}});
  });

  $(document).on('click', "[id*='inc']", function() {
    var $idParts = $(this).attr('id').split('_'),
        id = $idParts[0],
        stat = $idParts[1]
        stats = {},
        stats[stat] = 1;

    Players.update({_id: id}, {$inc: stats});
  });

  $(document).on('click', "[id*='dec']", function() {
    var $idParts = $(this).attr('id').split('_'),
        id = $idParts[0],
        stat = $idParts[1]
        stats = {},
        stats[stat] = -1;

    Players.update({_id: id}, {$inc: stats});
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Fields.find().count() > 0) {
      Fields.remove({});
    }

    if (Zones.find().count() > 0) {
      Zones.remove({});
    }

    if (Players.find().count() > 0) {
      Players.remove({});
    }

    if (Codices.find().count() > 0) {
      Codices.remove({});
    }

    if (Cards.find().count() > 0) {
      Cards.remove({});
    }

    initGame(2);
  });

  function initGame(number) {
    var card_types = ['defence', 'attack', 'enhancement'];

    for (var i = 0; i < 40; i++) {
      Cards.insert({
        name: 'card' + i,
        type: card_types[Math.floor(Math.random() * 3)],
        active: false
      });
    }

    for (var i = 0; i < number; i++) {

      Codices.insert({
        name: 'codex' + i,
        cards: Cards.find({}, {limit: 20, skip: i * 20}).fetch()
      });

      Players.insert({
        name: 'magi' + i,
        essence: 10,
        resonance: 0,
        harmony: 0,
        discord: 0,
        codex: Codices.findOne({name: 'codex' + i})
      });

      Zones.insert({
        player: Players.findOne({name: 'magi' + i})
      });
    };

    Fields.insert({
      zones: Zones.find().fetch()
    });
  }
}
