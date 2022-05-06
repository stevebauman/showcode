import { mount } from 'vue-composable-tester';
import useShiki from '@/composables/useShiki';
import Vue from 'vue';
import Sinon from 'sinon';

describe('useShiki', () => {
    it('builds code blocks', async () => {
        const shiki = {
            getTheme: () => {},
            loadTheme: () => {},
            loadLanguages: () => {},
        };

        const mock = Sinon.mock(shiki);

        mock.expects('loadLanguages').once().withArgs([]);
        mock.expects('loadTheme').once().withArgs('github-light');
        mock.expects('getTheme').once().withArgs('github-light').returns({
            name: 'github-light',
            fg: '#fff',
            bg: '#fff',
            type: 'light',
        });

        Vue.prototype.$nuxt = {
            context: {
                $shiki: shiki,
            },
        };

        const {
            result: { buildCodeBlocks },
        } = mount(() => useShiki());

        await buildCodeBlocks({}, ({ blocks }) => {
            expect(blocks).toEqual([]);
        });

        mock.verify();
    });
});
