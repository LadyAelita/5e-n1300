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

### Fall damage

Like noted previously, **fall** damage is generally not reduced.

At the end of a fall, a creature takes **1d6** bludgeoning damage for every **10 feet** it fell, to a **maximum of 20d6**. The creature lands prone, unless it somehow avoids taking damage from the fall.

The following table describes the downward velocity **V<sub>i</sub>**, with which the creature hit the ground, based on the fall damage roll, which corresponds to specific fall distances.

| Fall distance | Roll | V<sub>i</sub> |
| ------------- | ---- | ------------- |
| 0-9 ft        | 0    | 0-25 ft/s     |
| 10-19 ft      | 1d6  | 30 ft/s       |
| 20-29 ft      | 2d6  | 40 ft/s       |
| 30-39 ft      | 3d6  | 45 ft/s       |
| 40-49 ft      | 4d6  | 50 ft/s       |
| 50-59 ft      | 5d6  | 60 ft/s       |
| 60-69 ft      | 6d6  | 65 ft/s       |
| 70-79 ft      | 7d6  | 70 ft/s       |
| 80-89 ft      | 8d6  | 75 ft/s       |
| 90-99 ft      | 9d6  | 77 ft/s       |
| 100-109 ft    | 10d6 | 82 ft/s       |
| 110-119 ft    | 11d6 | 85 ft/s       |
| 120-129 ft    | 12d6 | 89 ft/s       |
| 130-139 ft    | 13d6 | 93 ft/s       |
| 140-149 ft    | 14d6 | 96 ft/s       |
| 150-159 ft    | 15d6 | 100 ft/s      |
| 160-169 ft    | 16d6 | 102 ft/s      |
| 170-179 ft    | 17d6 | 105 ft/s      |
| 180-189 ft    | 18d6 | 109 ft/s      |
| 190-199 ft    | 19d6 | 110 ft/s      |
| 200+ ft       | 20d6 | 113 ft/s      |

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

### Overkill

Massive damage can kill you **instantly**. When damage reduces you to 0 hit points and there is damage remaining, you die if the **remaining damage equals or exceeds your hit point maximum**.

For example, a cleric with a maximum of 12 hit points currently has 6 hit points. If she takes 18 damage from an attack, she is reduced to 0 hit points, but 12 damage remains. Because the remaining damage equals her hit point maximum, the cleric dies.

**Warning:** You can get **one-shot instantly** from **full health** if you take damage **equal to twice your health maximum**.

### Cinematic death

The GM might just **announce** that your character **dies** as a result of something taking place outside of regular combat rules. For example, if you voluntarily jump into an active volcano, it's very likely that you're going to die without any saving throws or damage rolls.

### Going down

If damage reduces you to 0 hit points without instantly killing you, you go into one of three unconscious states, each more severe than the previous one. The three states are **unconscious**, **battered** and **dying**. If you're in any of those states, you're considered to be "**down**".

If you get reduced to 0 hit points by either an attack thrown with the **intent to only knock you out** without killing you, or a **non-magical unarmed strike** that deals **bludgeoning** damage, you become **unconscious**.

If you get reduced to 0 hit points by a **non-magical weapon** attack that deals **physical** (slashing, piercing or bludgeoning) damage, or a **non-magical unarmed attack** that deals **slashing** or **piercing** damage (such as a claw or bite attack), and the attack **was not a critical hit** you become **battered**.

If you get reduced to 0 hit points by an attack that doesn't make you unconscious or battered, you become **dying**.

**Note:** You're considered "**stable**" if you're neither **battered** nor **dying**, given how both of those states have the character make **death saving throws** in regular intervals. Being stable/unstable is not a mechanic, just a way to denote that a character is at a risk of passing away if no action is taken to prevent that.

### Getting worse

Whenever an **unconscious** creature takes damage, it becomes **battered**, if the damage was from a **non-magical weapon** attack that deals **physical** (slashing, piercing or bludgeoning) damage, or a **non-magical unarmed attack** that deals **slashing** or **piercing** damage (such as a claw or bite attack), and the attack **was not a critical hit**. Otherwise, it becomes **dying**.

Whenever a **battered** creature takes damage, it becomes **dying**.

Whenever a **dying** creature takes damage, it makes a **death saving throw**.

### Death saving throws

A **death saving throw** is a **Constitution** saving throw against the **DC** of **10**. Every time you **fail** a death saving throw, you mark it on your character sheet. Once you accumulate **three failures**, you **die**.

When you make a death saving throw and roll a **natural 1**, it counts as **two failures**. If you roll a natural 20, and have marked failures, you **remove one failure**. If you don't have any failures, you **regain 1 hit point**, which stabilizes you.

You make a death saving throw at the start of **every 10 minutes** if you're **battered**, or at the start of **each turn** if you're **dying**. You can get advantage on these death saving throws if someone successfully provides you with **makeshift first aid** (without a healing kit).

**Dying** creatures also make a **death saving throw** whenever they **take damage**.

You erase all accumulated death saving throw failures once you become conscious again.

### Saving dying creatures

**Healing** is the most reliable and effective way to get a dying creature back up. If a creature that's **dying** or **battered** regains a positive number of hit points, it becomes only **unconscious**, keeping the hit points regained as a result of the heal. If an **unconscious** creature regains a positive number of hit points, it becomes conscious again.

Alternatively, you can provide **first aid** to a **dying** or **battered** creature using a **healer's kit**. In such case, you make a Medicine or a Survival check **with advantage** against the DC of 10. A success improves the creature's state by **one degree**, meaning it goes from **dying** to **battered**, or from **battered** to **unconscious**. The creature also makes the death saving throws with **advantage**.

A **healer's kit** can be used to improve a creature's state only **once** - you **can't** use it **twice in a row** on a dying creature to get it back to unconscious. This condition resets on a creature once it becomes conscious again.

If you don't have a healer's kit, you can attempt **makeshift first aid**. You make the same Medicine/Survival check against DC of 10, but **without advantage**. If you succeed, the target creature's state doesn't get better, but it still gets advantage on **death saving throws**.

### Regaining consciousness

When a creature **stops being unconscious**, it is still **stunned** until it spends its **entire turn** to compose itself by making a Composure check against DC 10. Such attempts can be repeated until success.

### Coup de Grâce

If a creature **within 5 feet of you** is **helpless** (which it is if it's **down**), you can take a **full round action** to execute a single weapon attack (melee or ranged) in an attempt to finish it off. This is called Coup de Grâce.

Coup de Grâce **provokes opportunity attacks**. If you get hit with an opportunity attack provoked by your attempt at a Coup de Grâce, the Coup de Grâce is **interrupted** and **has no effect**.

If nobody interrupts your Coup de Grâce, you make an attack roll against the target, **without any advantages** that come with the target being helpless. If you **hit**, the target **dies**. If you **miss**, you "only" **hit the target critically** and deal approperiate damage.

Coup de Grâce can only be attempted using the following weapons:

* any martial weapon, save for lance, whip, blowgun and net,
* dagger,
* handaxe,
* sickle,
* spear,
* light crossbow.

**Warning:** If you're using an **exotic** weapon, it's best to ask your GM if it can be used to perform a Coup de Grâce. Or simply carry a spare dagger on you at all times. Also, bear in mind that any weapon can be used to finish somebody off given enough time (through attacking them, thus triggering a death save on each attack), it's just that Coup de Grâce lets you do this within a single turn.

