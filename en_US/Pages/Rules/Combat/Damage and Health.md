[gimmick:title](Damage and Health)

# Damage and Health

## Hit Points

A creature's current **hit points** (**HP**) can be any positive number not greater than the creature's **hit point maximum**.

Whenever a creature takes **damage**, that damage is **subtracted** from its **hit points**. The loss of hit points has **no effect** on a creature's capabilities until the creature **drops to 0 hit points**.

## Healing

When a creature receives healing of any kind, hit points regained are added to its current hit points. A creature's hit points can't exceed its hit point maximum, so any hit points regained in excess of this number are lost. For example, a druid grants a ranger 8 hit points of healing. If the ranger has 14 current hit points and has a hit point maximum of 20, the ranger regains 6 hit points from the druid, not 8.

## Temporary Hit Points

Some spells and special abilities confer **temporary hit points** to a creature. Temporary hit points aren't actual hit points; they are a **buffer** against damage, a pool of hit points that protect you from injury.

When you have temporary hit points and take damage, the temporary hit points are lost **first**, and any leftover damage carries over to your normal hit points. For example, if you have 5 temporary hit points and take 7 damage, you lose the temporary hit points and then take 2 damage.

Because temporary hit points are **separate** from your actual hit points, they can exceed your hit point maximum. A character can, therefore, be at full hit points and receive temporary hit points.

Healing **can't restore temporary hit points**, and they **can't be added together**. If you have temporary hit points and receive more of them, you decide whether to keep the ones you have or to gain the new ones. For example, if a spell grants you 12 temporary hit points when you already have 10, you can have 12 or 10, not 22.

If you have 0 hit points, receiving temporary hit points **doesn't restore you** to consciousness or stabilize you. They **can still absorb damage** directed at you while you're in that state, but only true healing can save you.

Unless a feature that grants you temporary hit points has a duration, they last until **they're depleted** or you **finish a long rest**.

## Damage rolls

When you hit, you roll to determine the damage dealt. The number and type of dice you roll for that purpose is determined by the weapon or the spell you've hit with. With a penalty, it is possible to deal 0 damage, but never negative damage.

When you roll for damage dealt with a **weapon** attack (or an unarmed attack), you add your **ability modifier** - the same ability modifier that you used for the attack roll. You do not do that for **spells**, unless it's explicitly noted in the spell's description.

You **do not add your proficiency** bonus to **damage** rolls.

If a spell or other effect deals damage to more than one target at the same time, roll the damage once for all of them.

### Maximized damage

If an effect's description says that you **maximize** a damage roll, that means you do not roll the dice, and instead take the **maximal possible number** you could potentially get from that roll.

The formula can be easily found by replacing every "**d**" with a **multiplication** operator. For example, **3d6 + 4** maximized is **3 * 6 + 4**, which is equal to **22**.

### Average damage

Sometimes it's useful to calculate the average result of a damage roll. To find the formula, replace every "d**X**" with "times **Y**", where **Y = half of X + ½**. For example, the average result of **3d6 + 4** is 3 \* (½ \* 6 + ½) + 4 = 3 \* 3½ + 4 = 10½ + 4 = **14½**.

## Critical hits

If the d20 die used for an attack roll lands on a 20, the attack hits regardless of any modifiers or the target's AC. This is called a **critical hit**. Some weapons or abilities might increase the **critical hit range**, meaning there are more numbers on the d20 that represent a critical hit when you roll and get them as the natural result.

The damage dealt by the critical hit is **the maximized damage roll + the result of the damage roll**. All modifiers are considered to be a **part of the damage roll**. Therefore, they are **counted twice** in total.

**Note:** To find the damage dealt by a critical hit, **roll for damage** as per usual, then determine the **maximal possible number** you could have got on that roll, **add that number to the result** of the roll, then **add all your modifiers twice**.

### Higher critical hit multipliers

Some weapons or abilities can provide an increase in **critical hit multiplier** (**cx**). The default multiplier for critical hits is **2**. For every **+1** multiplier **above 2**, roll for damage **an additional time** and add it to the result, **along with the modifiers**. 

In other words, you take the **number of damage rolls** equal to the critical multiplier, **adding the modifiers every single time**, and then you replace one of these rolls, **maximizing it** instead.

For example, if you have a weapon, whose description reads "*+2 cx*", or "*crit x4*", the total damage dealt by a crit with that weapon is **the maximized damage roll + 3 damage rolls**. In this example, the modifiers are counted **four times** in total.

## Damage types and origins

Dealt damage has a **type** and an **origin**, both used mostly for the purposes of damage resistance and immunity rules.

Damage **type** is given in the description of the weapon or the spell that is being used to inflict it. There exist following damage types, which can be further categorized into **elemental** and **non-elemental**:

| Elemental       | Non-elemental |
| --------------- | ------------- |
| fire            | slashing      |
| cold            | piercing      |
| acid            | bludgeoning   |
| radiant         | poison        |
| lightning       | psychic       |
| sonic (thunder) | necrotic      |
| shadow          | force         |
| ethereal        | fall          |

There also exists a **true** damage type. **True** damage and **fall** damage is **not** reduced by effects that reduce all damage regardless of type, unless it is explicitly stated that true/fall damage is reduced by that effect.

**Note:** **Slashing**, **piercing** and **bludgeoning** damage are relatively often bundled together and simply called **physical** damage.

Damage **origin** depends on how otherworldly the effect is. There exist three damage origins: **non-magical**, **magical**, **supernatural**. 

Non-magical is the most mundane origin and the simplest one to resist, while resisting supernatural damage is close to impossible. By default, weapons are **non-magical**, unless specified otherwise. Similarly, spells are, by default, **magical**. Generally nothing is **supernatural** by default.

## Resistance, Immunity and Vulnerability

If a creature or an object has **resistance** to a damage type, damage of that type is **halved** against it. If a creature or an object is **immune** to a damage type, it takes **no damage** of that type. If a creature or an object has **vulnerability** to a damage type, damage of that type is **doubled** against it.

Resistance and vulnerability are applied **after** all other damage reducing/amplifyling effects.

Multiple instances of resistance/vulnerability **don't stack**. Resistance and vulnerability to the same damage type do cancel each other out, though.

Resistances and immunities have **origins**, same as damage. All resistances and immunities are assumed by default to be **magical**, unless specified otherwise. Resistance/immunity applies as long as the damage dealt is of the same type and **equally or less mundane** origin. 

For example, magical resistance to fire doesn't protect against supernatural fire, but it protects against non-magical and magical fire. Supernatural resistance to fire protects against all three origins of fire.

|                             | Non-magical damage | Magical damage | Supernatural damage |
| --------------------------- | ------------------ | -------------- | ------------------- |
| **Non-magical resistance**  | Resistant          | -              | -                   |
| **Magical resistance**      | Resistant          | Resistant      | -                   |
| **Supernatural resistance** | Resistant          | Resistant      | Resistant           |

## Death

When you drop to 0 hit points, you either die outright or fall unconscious.

Most GMs have a monster die the instant it drops to 0 hit points, rather than having it fall unconscious.

Mighty villains and special nonplayer characters are common exceptions; the GM might have them fall unconscious and follow the same rules as player characters. 

*TODO: Link death page here*

