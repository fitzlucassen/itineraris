import { ItinerarisPage } from './app.po';

describe('itineraris App', function() {
  let page: ItinerarisPage;

  beforeEach(() => {
    page = new ItinerarisPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
