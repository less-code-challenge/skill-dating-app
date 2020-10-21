import {customAlphabet} from 'nanoid';
import {assert} from './validation';
import {AttributeMap, HavingPrimaryKey, SerializableAsAttributeMap} from './common';

export class SkillId {
  static readonly attributeName = 'id';
  static readonly size = 14;
  static readonly alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  static readonly alphabetRegExp = new RegExp(`^[0-9A-Z]{${SkillId.size}}$`);
  private static readonly generateId = customAlphabet(SkillId.alphabet, SkillId.size);

  static parse(value: string | undefined): SkillId {
    assert('skill ID').of(value)
      .isNotEmpty()
      .isNotLongerThan(SkillId.size)
      .matches(SkillId.alphabetRegExp);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore value at this point is not empty
    return new SkillId(value.trim());
  }

  static generateNew(): SkillId {
    return SkillId.parse(SkillId.generateId());
  }

  private constructor(public readonly value: string) {
  }
}

export class SkillName {
  static readonly attributeName = 'name';
  static readonly maxLength = 40;
  static readonly notEmpty = true

  static parse(value: string | undefined): SkillName {
    assert('skill name').of(value)
      .isNotEmpty()
      .isNotLongerThan(SkillName.maxLength);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore value at this point is not empty
    return new SkillName(value.trim());
  }

  constructor(public readonly value: string) {
  }
}

export class Skill implements HavingPrimaryKey, SerializableAsAttributeMap {
  static createNew(name: SkillName): Skill {
    return new Skill(SkillId.generateNew(), name);
  }

  static parse(id: string | undefined, name: string | undefined): Skill {
    return new Skill(SkillId.parse(id), SkillName.parse(name));
  }

  private constructor(public readonly id: SkillId, public readonly name: SkillName) {
  }

  toPlainAttributes(): AttributeMap {
    const skillAttributes: AttributeMap = {};
    skillAttributes[SkillId.attributeName] = this.id.value;
    skillAttributes[SkillName.attributeName] = this.name.value;
    return skillAttributes;
  }

  getPrimaryKeyAsString(): string {
    return this.id.value;
  }
}

export type SkillMap = { [skillId: string]: Skill };

export const skillsAttributeName = 'skills';

export function createSkillIdsFromAttributes(attributes: AttributeMap): SkillId[] {
  if (attributes) {
    const skills = attributes[skillsAttributeName];
    if (skills && Array.isArray(skills)) {
      return skills.map(skillAttributes => SkillId.parse(skillAttributes[SkillId.attributeName]));
    }
  }
  return [];
}

interface SkillUpdateBuilder {
  idsOfOldSkills(skillIds?: SkillId[]): SkillUpdateBuilder;
  idsOfNewSkills(skillIds?: SkillId[]): SkillUpdateBuilder;

  build(): SkillUpdate;
}

export class SkillUpdate {
  static builder(): SkillUpdateBuilder {
    let oldSkillIds: SkillId[];
    let newSkillIds: SkillId[];

    return {
      idsOfOldSkills(skillIds: SkillId[]) {
        oldSkillIds = skillIds && Array.isArray(skillIds)  ? [...skillIds] : [];
        return this;
      },

      idsOfNewSkills(skillIds: SkillId[]) {
        newSkillIds = skillIds && Array.isArray(skillIds) ? [...skillIds] : [];
        return this;
      },

      build(): SkillUpdate {
        const toPut = newSkillIds.filter(skillNotAmong(oldSkillIds));
        const toDelete = oldSkillIds.filter(skillNotAmong(newSkillIds));

        return new SkillUpdate(toPut, toDelete);
      }
    };

    function skillNotAmong(otherSkillIds: SkillId[]) {
      return function (newSkillId: SkillId) {
        return !otherSkillIds.find(oldSkillId => oldSkillId.value === newSkillId.value);
      };
    }
  }

  skillsToPut: Skill[] = [];

  private constructor(public readonly idsOfSkillsToPut: SkillId[],
                      private readonly idsOfSkillsToDelete: SkillId[]) {
  }

  mapSkillsToPut<U>(callbackFn: (value: Skill, index: number, array: Skill[]) => U): U[] {
    return this.skillsToPut.map<U>(callbackFn);
  }

  mapIdsOfSkillsToDelete<U>(callbackFn: (value: SkillId, index: number, array: SkillId[]) => U): U[] {
    return this.idsOfSkillsToDelete.map<U>(callbackFn);
  }

  hasSkillsToPut(): boolean {
    return !!(this.idsOfSkillsToPut && this.idsOfSkillsToPut.length);
  }

  hasSkillsToDelete(): boolean {
    return !!(this.idsOfSkillsToDelete && this.idsOfSkillsToDelete.length);
  }

  enrichSkillsToPutBySkillNames(skillMap: SkillMap): void {
    this.skillsToPut = this.idsOfSkillsToPut.map(skillId => skillMap[skillId.value]);
  }

  isEmpty(): boolean {
    const noSkillsToPut = !this.hasSkillsToPut();
    const noSkillsToDelete = !this.hasSkillsToDelete();
    return noSkillsToPut && noSkillsToDelete;
  }
}
