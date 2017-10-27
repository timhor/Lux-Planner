import { Seng2021ProjectPage } from './app.po';

describe('lux-planner App', () => {
  let page: Seng2021ProjectPage;

  beforeEach(() => {
    page = new Seng2021ProjectPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
