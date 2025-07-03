import { describe, it, expect } from 'vitest'
import {
    toValidIdentifier,
    toKebabCase,
    capitalize,
    generateStoryUrl,
    fileExists,
    updateStoryImport
} from './utils.js'

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

describe('toKebabCase', () => {
    it('converts camelCase to kebab-case', () => {
        expect(toKebabCase('myComponent')).toBe('my-component');
        expect(toKebabCase('testComponent')).toBe('test-component');
        expect(toKebabCase('audioEngine')).toBe('audio-engine');
    });

    it('handles PascalCase', () => {
        expect(toKebabCase('MyComponent')).toBe('my-component');
        expect(toKebabCase('TestComponent')).toBe('test-component');
    });

    it('handles existing hyphens and underscores', () => {
        expect(toKebabCase('my-component')).toBe('my-component');
        expect(toKebabCase('my_component')).toBe('my-component');
        expect(toKebabCase('my--component')).toBe('my-component');
        expect(toKebabCase('my___component')).toBe('my-component');
    });

    it('handles mixed separators', () => {
        expect(toKebabCase('myComponent_test')).toBe('my-component-test');
        expect(toKebabCase('MyComponent_test')).toBe('my-component-test');
    });

    it('handles numbers', () => {
        expect(toKebabCase('synthI001')).toBe('synth-i001');
        expect(toKebabCase('SynthI001')).toBe('synth-i001');
        expect(toKebabCase('test123')).toBe('test123');
    });

    it('handles edge cases', () => {
        expect(toKebabCase('')).toBe('');
        expect(toKebabCase('A')).toBe('a');
        expect(toKebabCase('a')).toBe('a');
        expect(toKebabCase('123')).toBe('123');
    });

    it('real-world examples', () => {
        expect(toKebabCase('Test-sketch')).toBe('test-sketch');
        expect(toKebabCase('Test-sketch002')).toBe('test-sketch002');
        expect(toKebabCase('Oscillator')).toBe('oscillator');
        expect(toKebabCase('mySynthSynthI001')).toBe('my-synth-synth-i001');
    });
});

describe('capitalize', () => {
    it('capitalizes first letter', () => {
        expect(capitalize('test')).toBe('Test');
        expect(capitalize('component')).toBe('Component');
        expect(capitalize('synth')).toBe('Synth');
    });

    it('handles already capitalized strings', () => {
        expect(capitalize('Test')).toBe('Test');
        expect(capitalize('Component')).toBe('Component');
    });

    it('handles edge cases', () => {
        expect(capitalize('')).toBe('');
        expect(capitalize('a')).toBe('A');
        expect(capitalize('A')).toBe('A');
    });
});

describe('generateStoryUrl', () => {
    it('generates correct Ladle story URLs', () => {
        expect(generateStoryUrl('Test-sketch')).toBe('http://localhost:61000/?story=test-sketch--default');
        expect(generateStoryUrl('Oscillator')).toBe('http://localhost:61000/?story=oscillator--default');
        expect(generateStoryUrl('mySynthSynthI001')).toBe('http://localhost:61000/?story=my-synth-synth-i001--default');
    });

    it('handles various naming patterns', () => {
        expect(generateStoryUrl('test-component')).toBe('http://localhost:61000/?story=test-component--default');
        expect(generateStoryUrl('TestComponent')).toBe('http://localhost:61000/?story=test-component--default');
        expect(generateStoryUrl('test_component')).toBe('http://localhost:61000/?story=test-component--default');
    });
});

describe('fileExists', () => {
    it('returns true for existing files', () => {
        expect(fileExists('package.json')).toBe(true);
        expect(fileExists('scripts/utils.js')).toBe(true);
    });

    it('returns false for non-existing files', () => {
        expect(fileExists('non-existing-file.txt')).toBe(false);
        expect(fileExists('scripts/non-existing.js')).toBe(false);
    });
});

describe('updateStoryImport', () => {
    it('updates import path correctly', () => {
        // Create a temporary story file for testing
        const fs = await
        import ('fs');
        const tempFile = 'temp-story.tsx';
        const originalContent = `import type { Story } from '@ladle/react'
import { Testsketch } from './Test-sketch'

export const Default: Story = () => <Testsketch />`;

        fs.writeFileSync(tempFile, originalContent);

        const result = updateStoryImport(tempFile, 'Test-sketch', 'Test-sketch002');

        expect(result).toBe(true);

        const updatedContent = fs.readFileSync(tempFile, 'utf8');
        expect(updatedContent).toContain("from './Test-sketch002'");

        // Clean up
        fs.unlinkSync(tempFile);
    });

    it('handles errors gracefully', () => {
        const result = updateStoryImport('non-existing-file.tsx', 'old', 'new');
        expect(result).toBe(false);
    });
});