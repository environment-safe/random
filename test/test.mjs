/* global describe:false */
import { chai } from '@environment-safe/chai';
import { it } from '@open-automaton/moka';
import { Random } from '../src/index.mjs';
const should = chai.should();

//create random strings for state comparison tests
const generator = new Random();
const emphemeralTestStringA = generator.string();
const emphemeralTestStringB = generator.string();

console.log(
    '      id1:', 
    emphemeralTestStringA, 
    '      id2:', 
    emphemeralTestStringB
);


describe('@environment-safe/random', ()=>{
    describe('Random', ()=>{
        it('generates a deterministic sequence from a static seed', async ()=>{
            const generator = new Random({seed: 'just a thing.'});
            should.exist(generator);
            const a = generator.random();
            const b = generator.random();
            const c = generator.random();
            a.should.equal(0.6262528219084247);
            b.should.equal(0.7391571298976854);
            c.should.equal(0.37971745613136204);
        });
        
        it('generates a deterministic sequence from a random seed(id1)', async ()=>{
            const generator = new Random({seed: emphemeralTestStringA});
            const a = generator.random();
            const b = generator.random();
            const c = generator.random();
            const generator2 = new Random({seed: emphemeralTestStringA});
            const a2 = generator2.random();
            const b2 = generator2.random();
            const c2 = generator2.random();
            a.should.equal(a2);
            b.should.equal(b2);
            c.should.equal(c2);
        });
        
        it(
            'generates a different sequence between 2 random seeds (id1 v id2)', 
            async ()=>{
                const generator = new Random({seed: emphemeralTestStringA});
                const a = generator.random();
                const b = generator.random();
                const c = generator.random();
                const generator2 = new Random({seed: emphemeralTestStringB});
                const a2 = generator2.random();
                const b2 = generator2.random();
                const c2 = generator2.random();
                a.should.not.equal(a2);
                b.should.not.equal(b2);
                c.should.not.equal(c2);
            }
        );
        
        it(
            'generates a different sequence between 2 default seeds', 
            async ()=>{
                const generator = new Random();
                const a = generator.random();
                const b = generator.random();
                const c = generator.random();
                const generator2 = new Random();
                const a2 = generator2.random();
                const b2 = generator2.random();
                const c2 = generator2.random();
                a.should.not.equal(a2);
                b.should.not.equal(b2);
                c.should.not.equal(c2);
            }
        );
    });
});
