import { describe, it, expect } from 'vitest'
import { incrementSketchName } from './incrementSketchName.js'
import { toValidIdentifier } from './generate.js'

describe('incrementSketchName', () => {
    it('increments Synth-i001 to Synth-i002', () => {
        expect(incrementSketchName('Synth-i001')).toBe('Synth-i002')
    })
    it('increments sketch099 to sketch100', () => {
        expect(incrementSketchName('sketch099')).toBe('sketch100')
    })
    it('increments v009 to v010', () => {
        expect(incrementSketchName('v009')).toBe('v010')
    })
    it('returns name002 if no number', () => {
        expect(incrementSketchName('sketch')).toBe('sketch002')
    })
    it('increments single digit number', () => {
        expect(incrementSketchName('foo1')).toBe('foo2')
    })
    it('increments many digit numbers', () => {
        expect(incrementSketchName('foo0000001')).toBe('foo0000002')
    })
    it('increments name ending with digit', () => {
        expect(incrementSketchName('bar7')).toBe('bar8')
    })
    it('increments name with no number and ending with non-digit', () => {
        expect(incrementSketchName('bar')).toBe('bar002')
    })
})

describe('toValidIdentifier', () => {
    it('converts simple hyphenated names', () => {
        expect(toValidIdentifier('my-component')).toBe('mycomponent');
        expect(toValidIdentifier('test-component')).toBe('testcomponent');
    });

    it('handles multiple hyphens', () => {
        expect(toValidIdentifier('my-synth-component')).toBe('mysynthcomponent');
        expect(toValidIdentifier('audio-synth-with-controls')).toBe('audiosynthwithcontrols');
    });

    it('handles numbers in names', () => {
        expect(toValidIdentifier('synth-i001')).toBe('synthi001');
        expect(toValidIdentifier('component-123')).toBe('component123');
    });

    it('handles numbers at start of parts', () => {
        expect(toValidIdentifier('synth-001')).toBe('synth001');
        expect(toValidIdentifier('audio-123-synth')).toBe('audio123synth');
    });

    it('handles leading/trailing hyphens', () => {
        expect(toValidIdentifier('-my-component-')).toBe('mycomponent');
        expect(toValidIdentifier('---test---')).toBe('test');
    });

    it('handles consecutive hyphens', () => {
        expect(toValidIdentifier('my--component')).toBe('mycomponent');
        expect(toValidIdentifier('test---synth')).toBe('testsynth');
    });

    it('handles empty or invalid input', () => {
        expect(toValidIdentifier('')).toBe('Component');
        expect(toValidIdentifier('   ')).toBe('Component');
        expect(toValidIdentifier('---')).toBe('Component');
        expect(toValidIdentifier(null)).toBe('Component');
        expect(toValidIdentifier(undefined)).toBe('Component');
        expect(toValidIdentifier(123)).toBe('Component');
    });

    it('handles single words', () => {
        expect(toValidIdentifier('component')).toBe('component');
        expect(toValidIdentifier('synth')).toBe('synth');
    });

    it('handles mixed case', () => {
        expect(toValidIdentifier('My-Component')).toBe('MyComponent');
        expect(toValidIdentifier('MY-SYNTH')).toBe('MYSYNTH');
        expect(toValidIdentifier('my-SYNTH-Component')).toBe('mySYNTHComponent');
    });

    it('handles special characters', () => {
        expect(toValidIdentifier('my-component!')).toBe('Component');
        expect(toValidIdentifier('test@synth')).toBe('Component');
    });

    it('handles edge cases with numbers', () => {
        expect(toValidIdentifier('123-component')).toBe('_123component');
        expect(toValidIdentifier('component-123-456')).toBe('component123456');
        expect(toValidIdentifier('123-456-789')).toBe('_123456789');
    });

    it('real-world examples', () => {
        expect(toValidIdentifier('Synth-i001')).toBe('Synthi001');
        expect(toValidIdentifier('Synth-i002')).toBe('Synthi002');
        expect(toValidIdentifier('mySynth-Synth-i001')).toBe('mySynthSynthi001');
        expect(toValidIdentifier('audio-engine-test')).toBe('audioenginetest');
    });
});