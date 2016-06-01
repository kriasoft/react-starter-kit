Steps:

* `server.js` calls `Router.dispatch()` to create a React component `<App>`, and then renders it with `ReactDOM.renderToString(component)` (at sever-side).

* The rendered DOM string is stored in `data.body`. It is then wrapped into a proper `<html>` string using template `/views/index.jade`.

* `Router.dispatch()` also generates `data.css` dynamically, based on the page content.

* The template has some parameters: `{ title: '', description: '', css: '', body: '', entry: assets.main.js }`. See simplified code below:

```
  head
    title= title
    meta(name="description", description=description)
    style#css!= css    // data.css
  body
    #app!= body        // data.body
    script(src=entry)  // data.entry = assets.main.js = client.js (see webpack.config.js). This loads the whole app.
```

* The actual `Router` is defined in `routes.js` based on `react-routing` package.

```
const router = new Router(on => {
  on('*', async (state, next) => {
    const component = await next();    // Actual data is rendered by the routes below
    return component && <App context={state.context}>{component}</App>;  // Always return <App> component
  });

  on('/contact', async () => <ContactPage />);  // Handle standard React pages.
  ...

  on('*', async (state) => {                    // Handle static content pages / REST APIs
    const query = `/graphql?query={content(path:"${state.path}"){path,title,content,component}}`;
    const response = await fetch(query);
    const { data } = await response.json();
    return data && data.content && <ContentPage {...data.content} />;
  });
});
```

* App.js is the container React component:

```
  <div>
    <Header />
    {this.props.children}
    <Feedback />
    <Footer />
  </div>
```

* Example page: Contact

```
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ContactPage.scss';   // scss

class ContactPage extends Component {
  ...
  render() {
    return (
      <div className={s.root}>       // scss
        <div className={s.container}>
          <h1>{title}</h1>
          <p>...</p>
        </div>
      </div>
    );
  }

}
export default withStyles(ContactPage, s);  // higher-order function applies CSS to <ContactPage>
```

* Loading whole app with `client.js`

After rendering the requested page, the whole app needs to be loaded in background. This is done in `client.js`:

```
// Run the application when both DOM is ready and page content is loaded
if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {
  run();
}
```

`client.js` also handles client-side routing:

```
  // Re-render the app when window.location changes
  const unlisten = Location.listen(location => {

    currentLocation = location;
    currentState = Object.assign({}, location.state, {
      path: location.pathname,
      query: location.query,
      state: location.state,
      context,
    });
    render(currentState); // calls Router.dispatch() and ReactDOM.render()
  });
```

where the isomorphic `Location` is defined in `core/Location.js`:

```
  Location = useQueries(process.env.BROWSER ? createHistory : createMemoryHistory)();
```
