describe('Итоговое задание: RPG', () => {
  describe('Оружие', () => {
    it('создаёт базовое оружие и снижает прочность не ниже нуля', () => {
      const weapon = new Weapon('Старый меч', 20, 10, 1);

      expect(weapon.name).toBe('Старый меч');
      expect(weapon.attack).toBe(20);
      expect(weapon.durability).toBe(10);
      expect(weapon.initDurability).toBe(10);
      expect(weapon.range).toBe(1);

      weapon.takeDamage(5);
      expect(weapon.durability).toBe(5);

      weapon.takeDamage(50);
      expect(weapon.durability).toBe(0);
      expect(weapon.isBroken()).toBe(true);
    });

    it('считает урон с учётом износа', () => {
      const bow = new Bow();

      expect(bow.getDamage()).toBe(10);

      bow.takeDamage(100);
      expect(bow.getDamage()).toBe(10);

      bow.takeDamage(50);
      expect(bow.getDamage()).toBe(5);

      bow.takeDamage(150);
      expect(bow.getDamage()).toBe(0);
    });

    it('создаёт все виды оружия с правильными характеристиками', () => {
      expect(new Arm()).toEqual(jasmine.objectContaining({
        name: 'Рука',
        attack: 1,
        durability: Infinity,
        initDurability: Infinity,
        range: 1,
      }));
      expect(new Sword()).toEqual(jasmine.objectContaining({
        name: 'Меч',
        attack: 25,
        durability: 500,
        range: 1,
      }));
      expect(new Knife()).toEqual(jasmine.objectContaining({
        name: 'Нож',
        attack: 5,
        durability: 300,
        range: 1,
      }));
      expect(new Staff()).toEqual(jasmine.objectContaining({
        name: 'Посох',
        attack: 8,
        durability: 300,
        range: 2,
      }));
      expect(new LongBow()).toEqual(jasmine.objectContaining({
        name: 'Длинный лук',
        attack: 15,
        durability: 200,
        range: 4,
      }));
      expect(new Axe()).toEqual(jasmine.objectContaining({
        name: 'Секира',
        attack: 27,
        durability: 800,
        range: 1,
      }));
      expect(new StormStaff()).toEqual(jasmine.objectContaining({
        name: 'Посох Бури',
        attack: 10,
        durability: 300,
        range: 3,
      }));
    });
  });

  describe('Персонажи', () => {
    it('создаёт базового игрока', () => {
      const player = new Player(10, 'Бэтмен');

      expect(player).toEqual(jasmine.objectContaining({
        life: 100,
        magic: 20,
        speed: 1,
        attack: 10,
        agility: 5,
        luck: 10,
        description: 'Игрок',
        position: 10,
        name: 'Бэтмен',
        maxLife: 100,
      }));
      expect(player.weapon instanceof Arm).toBe(true);
    });

    it('считает обычный урон только в радиусе оружия', () => {
      const player = new Player(0, 'Игрок');
      player.getLuck = () => 0.5;

      expect(player.getDamage(1)).toBe(5.5);
      expect(player.getDamage(2)).toBe(0);
    });

    it('получает урон и умирает без отрицательного здоровья', () => {
      const player = new Player(0, 'Хоббит');

      player.takeDamage(90);
      expect(player.life).toBe(10);
      expect(player.isDead()).toBe(false);

      player.takeDamage(90);
      expect(player.life).toBe(0);
      expect(player.isDead()).toBe(true);
    });

    it('создаёт базовые и улучшенные классы игроков', () => {
      expect(new Warrior(0, 'Воин')).toEqual(jasmine.objectContaining({
        life: 120,
        speed: 2,
        attack: 10,
        description: 'Воин',
      }));
      expect(new Archer(0, 'Лучник')).toEqual(jasmine.objectContaining({
        life: 80,
        magic: 35,
        attack: 5,
        agility: 10,
        description: 'Лучник',
      }));
      expect(new Mage(0, 'Маг')).toEqual(jasmine.objectContaining({
        life: 70,
        magic: 100,
        attack: 5,
        agility: 8,
        description: 'Маг',
      }));
      expect(new Dwarf(0, 'Гном')).toEqual(jasmine.objectContaining({
        life: 130,
        attack: 15,
        luck: 20,
        description: 'Гном',
      }));
      expect(new Crossbowman(0, 'Арбалетчик')).toEqual(jasmine.objectContaining({
        life: 85,
        attack: 8,
        agility: 20,
        luck: 15,
        description: 'Арбалетчик',
      }));
      expect(new Demiurge(0, 'Демиург')).toEqual(jasmine.objectContaining({
        life: 80,
        magic: 120,
        attack: 6,
        luck: 12,
        description: 'Демиург',
      }));
    });

    it('использует особую формулу урона лучника', () => {
      const archer = new Archer(0, 'Леголас');
      archer.getLuck = () => 0.5;

      expect(archer.getDamage(3)).toBe(7.5);
      expect(archer.getDamage(4)).toBe(0);
    });

    it('воин при удаче тратит ману вместо жизни, если здоровье ниже половины', () => {
      const warrior = new Warrior(0, 'Алёша');
      warrior.getLuck = () => 0.9;
      warrior.life = 50;

      warrior.takeDamage(5);

      expect(warrior.life).toBe(50);
      expect(warrior.magic).toBe(15);
    });

    it('маг с маной выше 50 получает половину урона и тратит 12 маны', () => {
      const mage = new Mage(0, 'Гендальф');

      mage.takeDamage(50);

      expect(mage.life).toBe(45);
      expect(mage.magic).toBe(88);
    });

    it('гном каждый шестой удачный удар получает вдвое меньше урона', () => {
      const dwarf = new Dwarf(0, 'Торин');
      dwarf.getLuck = () => 0.6;

      for (let i = 0; i < 5; i += 1) {
        dwarf.takeDamage(10);
      }

      dwarf.takeDamage(10);

      expect(dwarf.life).toBe(75);
      expect(dwarf.enemyHits).toBe(6);
    });

    it('демиург усиливает урон в 1.5 раза при мане и удаче', () => {
      const demiurge = new Demiurge(0, 'Мерлин');
      demiurge.getLuck = () => 1;

      expect(demiurge.getDamage(1)).toBe(24);
    });
  });

  describe('Бой', () => {
    it('двигает игрока влево и вправо не дальше скорости', () => {
      const warrior = new Warrior(6, 'Алёша');

      warrior.moveLeft(5);
      expect(warrior.position).toBe(4);

      warrior.moveRight(2);
      expect(warrior.position).toBe(6);

      warrior.move(-10);
      expect(warrior.position).toBe(4);
    });

    it('блокирует, уклоняется или получает урон в правильном порядке', () => {
      const player = new Player(0, 'Цель');
      player.isAttackBlocked = () => true;
      player.dodged = () => false;

      player.takeAttack(10);
      expect(player.life).toBe(100);
      expect(player.weapon.durability).toBe(Infinity);

      player.isAttackBlocked = () => false;
      player.dodged = () => true;
      player.takeAttack(10);
      expect(player.life).toBe(100);

      player.dodged = () => false;
      player.takeAttack(10);
      expect(player.life).toBe(90);
    });

    it('меняет сломанное оружие на следующее в цепочке', () => {
      const warrior = new Warrior(0, 'Алёша');

      warrior.weapon.takeDamage(500);
      warrior.checkWeapon();
      expect(warrior.weapon instanceof Knife).toBe(true);

      warrior.weapon.takeDamage(300);
      warrior.checkWeapon();
      expect(warrior.weapon instanceof Arm).toBe(true);
    });

    it('атакует врага, изнашивает оружие и удваивает урон на одной позиции', () => {
      const warrior = new Warrior(0, 'Алёша');
      const archer = new Archer(0, 'Леголас');
      warrior.getLuck = () => 1;
      archer.isAttackBlocked = () => false;
      archer.dodged = () => false;

      warrior.tryAttack(archer);

      expect(warrior.weapon.durability).toBe(490);
      expect(archer.position).toBe(1);
      expect(archer.life).toBe(10);
    });

    it('выбирает врага с минимальным здоровьем и идёт к нему', () => {
      const warrior = new Warrior(10, 'Воин');
      const mage = new Mage(4, 'Маг');
      const archer = new Archer(6, 'Лучник');
      mage.life = 20;
      archer.life = 30;

      const enemy = warrior.chooseEnemy([
        warrior,
        mage,
        archer,
      ]);
      expect(enemy).toBe(mage);

      warrior.moveToEnemy(enemy);
      expect(warrior.position).toBe(8);
    });

    it('определяет победителя', () => {
      const warrior = new Warrior(0, 'Воин');
      const archer = new Archer(1, 'Лучник');
      warrior.getLuck = () => 1;
      archer.getLuck = () => 0;
      warrior.isAttackBlocked = () => false;
      warrior.dodged = () => false;
      archer.isAttackBlocked = () => false;
      archer.dodged = () => false;

      expect(play([warrior, archer])).toBe(warrior);
    });
  });
});
