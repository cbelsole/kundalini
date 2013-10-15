Players = new Meteor.Collection('players');

if (Meteor.isClient) {
  Template.game.players = function() {
    return Players.find({});
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
    if (Players.find().count() > 0) {
      Players.remove({});
    }

    initPlayers(2);
  });

  function initPlayers(number) {
    for (var i = 0; i < number; i++) {
      Players.insert({name: 'magi' + i, essence: 10, resonance: 0, harmony: 0, discord: 0});
    };
  }
}
