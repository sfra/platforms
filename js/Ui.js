define([], function () {
    return {
        context: null,
        endOfGame: false,
        lastMessage: '',
        life: 100,
        myNumber: null,
        player: {},
        playerDirection: [0, 1],
        otherPlayerLife: 100,
        shelfs: [],
        enemies: [],
        newStone: false,
        left: false,
        right: false,
        up: true,
        down: true,
        space: false,
        isJumping: false,
        faceToLeft: {now: true, prev: true},
        eventFrameSync: 0,
        gameSpeed: 15,
        turbo: 1,
        bullet: false,
        bulletDirection: -1,
        bulletFalling: [-1, -3, -2, -1, -1, 0, 0, 2, 2, 3, 3, 2, 2, 1, 1, -1, 1, -1, -1, -1, 1, 1, 1, 0],
        isSickStage: 0,
        isSickStageEnemy: 0
    }


});