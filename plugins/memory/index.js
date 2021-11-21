import Store from './store';

export default async (context, inject) => {
    inject('memory', {
        pages: new Store('pages'),
        settings: new Store('settings'),
        templates: new Store('templates'),
    });
};
