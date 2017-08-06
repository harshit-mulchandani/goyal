import { GoyalPage } from './app.po';

describe('goyal App', () => {
  let page: GoyalPage;

  beforeEach(() => {
    page = new GoyalPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
