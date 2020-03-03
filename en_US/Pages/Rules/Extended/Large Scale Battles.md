[gimmick:title](Large Scale Battles)

# Large Scale Battles

In some instances, fights might involve tens of thousands of creatures. Playing each individual creature would slow the game down to such an extent that it would be become unplayable. In order to make it a much more pleasant and satisfying experience, the following rules, that group multiple creatures into Units, might be used for such combat.

## Unit

A **Unit** is a group of creatures of the same type, which collectively is treated as a single entity in mass combat. Units work differently to regular creatures - they do not use **Hit Points**, which are replaced with **Vitality** and **Fortitude**. Instead of dealing damage, they inflict **Casualties**, and each Unit has variable morale, represented by **Fear** points.

## Vitality

**Vitality** is a **resource** corresponding to the number of creatures remaining in a given Unit, more specifically, the number of rows of creatures remaining. The **number of creatures** in a Unit is equal to **Vitality squared**.

Vitality works in a manner similar to Hit Points, in that a Unit starts with full Vitality, which depletes when the Unit takes **Casualties**. When Vitality reaches 0, the Unit is removed from battle.

The **Vitality** of Units and the **number of creatures** the Unit can contain is based on the Scaling Factor (described further on this page), as per the table below. Fractional results are **rounded down**, to a minimum of 1.

| Unit formation | Unit creature size    | Vitality                 |
| -------------- | --------------------- | ------------------------ |
| Loose          | Tiny                  | 2 times Scaling Factor   |
| Loose          | Small                 | Scaling Factor           |
| Loose          | Medium                | Scaling Factor           |
| Loose          | Large                 | 1/2 times Scaling Factor |
| Loose          | Huge                  | 1/3 times Scaling Factor |
| Loose          | Gargantuan (20x20 ft) | 1/4 times Scaling Factor |
| Tight          | Tiny                  | 4 times Scaling Factor   |
| Tight          | Small                 | 3 times Scaling Factor   |
| Tight          | Medium                | 2 times Scaling Factor   |
| Tight          | Large                 | Scaling Factor           |
| Tight          | Huge                  | 2/3 times Scaling Factor |
| Tight          | Gargantuan (20x20 ft) | 1/2 times Scaling Factor |

## Fortitude

**Fortitude** is a number that determines how difficult it is to deal lethal Casualties to a Unit. It's derived directly from the maximal number of Hit Points of the creature composing the Unit, according to the table below.

| Creature Hit Point maximum | Unit Fortitude |
| -------------------------- | -------------- |
| 4                          | 1              |
| 5                          | 2              |
| 6                          | 3              |
| 7                          | 4              |
| 8                          | 5              |
| 9                          | 6              |
| 10                         | 7              |
| 11-13                      | 8              |
| 14-17                      | 9              |
| 18-24                      | 10             |
| 25-40                      | 11             |
| 41-120                     | 12             |
| 121+                       | 13             |

**Warning:** A Unit with Fortitude 13 **cannot be damaged at all in mass combat**. The mighty heroes will need to engage such creatures in person.

## Casualties

**Casualties** is used instead of damage in mass combat. Each attack available to the Unit Casualties number, which determines how many Casualties they inflict on the target Unit on a hit, followed by a successful Casualty check.

The Casualties value assigned to a Unit's attack is derived directly from average damage of the corresponding attack of the creature composing that unit, and it's equal to the **attack's average damage over 5**, **rounded to the nearest integer**.

A **Casualty check** is done instead of a damage roll, after one Unit **hits** the other with an attack. It sees the player controlling the attacking unit **roll a d12**. If the result of the roll is **equal or greater** than the **target's Fortitude**, the target **loses** an amount of **Vitality** equal to the Casualties assigned to the given attack. Otherwise, nothing happens.

## Fear

**Fear** is the number describing the morale of a Unit. It can assume both **negative and positive values**, the **maximal Fear** being **6**, and the Fear minimum being unlimited.

Each unit starts the combat with initial Fear equal to **2 minus Charisma saving throw bonus** of the creature composing the unit. Units can then gain positive or negative Fear as a result of specific events.

If a Unit **has positive Fear**, it's considered to have a **number of fear condition levels** equal to their **Fear value**, meaning that it suffers from the related condition.

TODO: List situations that change morale

## Scaling Factor

An important concept to consider for large scale battles is the **Scaling Factor**. It's a number, greater than 1, that determines the scale of the **battle grid** with respect to a regular grid that would normally cover the same scenario in regular D&D. Given how it directly influences the number of feet represented by each square on the grid, it also determines how many creatures can there possibly be in a single Unit (on a single square). It can be adjusted by the DM to optimally represent the given scenario. For example, a clash of two armies, 2 000 soldiers each, is a different scenario than a clash of two armies 3 million strong.

- **One square** on the battle grid has a **side** equal to **5 feet times Scaling Factor**.
- **One battle round** is assumed to last **6 seconds times Scaling Factor**. This **doesn't increase** the number of actions that can be taken by each Unit in a single turn.
- The **movement speed** of a **Unit**, in **feet**, is its **walking speed times Scaling Factor**. Therefore, the movement speed in **squares** on the grid doesn't change.
- The **range** of all **spells** and **attacks**, in **feet**, is **multiplied by the Scaling Factor**. Therefore, the ranges in **squares** don't change.
- The **Vitality** and **number of creatures** in Units.