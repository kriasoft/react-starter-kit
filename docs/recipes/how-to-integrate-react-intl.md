## How to Integrate [React Intl](https://github.com/yahoo/react-intl#react-intl)

 1. Merge `feature/react-intl` branch with git.
    Because react-intl integration is built on top of `feature/redux`, you'll also get all the features.

 2. Adjust `INTL_REQUIRE_DESCRIPTIONS` constant in `tools/webpack.config.js` around line 17:
    ```js
    const INTL_REQUIRE_DESCRIPTIONS = true;
    ```
    When this boolean is set to true, the build will only succeed if a `description` is set for every message descriptor.

 3. Adjust `locales` settings in `src/config.js`:
    ```js
    // default locale is the first one
    export const locales = ['en-GB', 'cs-CZ'];
    ```
    Note that you should follow
    [BCP 47](https://tools.ietf.org/html/bcp47)
    ([RFC 5646](https://tools.ietf.org/html/rfc5646)).

 4. Add locale support in `src/client.js`:
    ```js
    import en from 'react-intl/locale-data/en';
    import cs from 'react-intl/locale-data/cs';
    ...

    [en, cs].forEach(addLocaleData);
    ```

 5. Execute `yarn run extractMessages` or `yarn start` to strip out messages.
    Message files are created in `src/messages` directory.

 6. Edit `src/messages/*.json` files, change only `message` property.

 7. Execute `yarn run build`,
    your translations should be copied to `build/messages/` directory.


### How to write localizable components

Just import the appropriate [component](https://github.com/yahoo/react-intl/wiki#the-react-intl-module) from `react-intl`

- For localizable text use
[`<FormattedMessage>`](https://github.com/yahoo/react-intl/wiki/Components#formattedmessage).
- You can also use it with
the [`defineMessages()`](https://github.com/yahoo/react-intl/wiki/API#definemessages) helper.

- For date and time:
[`<FormattedDate>`](https://github.com/yahoo/react-intl/wiki/Components#formatteddate)
[`<FormattedTime>`](https://github.com/yahoo/react-intl/wiki/Components#formattedtime)
[`<FormattedRelative>`](https://github.com/yahoo/react-intl/wiki/Components#formattedrelative)
 
- For numbers and currencies:
[`<FormattedNumber>`](https://github.com/yahoo/react-intl/wiki/Components#formattednumber)
[`<FormattedPlural>`](https://github.com/yahoo/react-intl/wiki/Components#formattedplural)

- If possible, do not use `<FormattedHTMLMessage>`, see how to use *Rich Text Formatting* with
[`<FormattedMessage>`](https://github.com/yahoo/react-intl/wiki/Components#formattedmessage)

- When you need an imperative formatting API, use the [`injectIntl`](https://github.com/yahoo/react-intl/wiki/API#injectintl) High-Order Component.

#### Example

```jsx
import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';

const messages = defineMessages({
  text: {
    id: 'example.text',
    defaultMessage: 'Example text',
    description: 'Hi Pavel',
  },
  textTemplate: {
    id: 'example.text.template',
    defaultMessage: 'Example text template',
    description: 'Hi {name}',
  },
});

function Example(props) {
  const text = props.intl.formatMessage(messages.textTemplate, { name: 'Pavel'});
  return (
    <div>
      <FormattedMessage
        id="example.text.inlineDefinition"
        defaultMessage="Hi Pavel"
        description="Example of usage without defineMessages"
      />
      <FormattedMessage {...messages.text} />
      <FormattedMessage
        {...messages.textTemplate}
        values={{
          name: <b>Pavel</b>
        }}
      />
    </div>
  );
}

Example.propTypes = {
  intl: intlShape,
}

export default injectIntl(Example);
```

### Updating translations

When running the development server, every source file is watched and parsed for changed messages.

Messages files are updated on the fly.
If a new definition is found, this definition is added to the end of every used `src/messages/xx-XX.json` file so when committing, new translations will be at the tail of file.

When an untranslated message is removed and its `message` field is empty as well, the message will be deleted from all translation files. This is why the `files` array is present.

When editing a translation file, it should be copied to `build/messages/` directory.

### Other References

 * [`Intl documentation on MDN`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl)
 * [express-request-language](https://github.com/tinganho/express-request-language#readme)
  – for more details how initial language negotiation works.
