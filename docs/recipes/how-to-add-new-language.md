# How to add new Language #

If you want to add new language in React Stater Kit (branch ```feature/react-intl```) you need to follow theses 4 steps.



* First of all you need to create language file (Json format). For exemple for French language

```
/src/messages/fr.json
```

* Translate languages keys

use ```message ``` and ```defaultMessage```.

```
[
  {
    "id": "header.banner.desc",
    "defaultMessage": "Complex web apps made easy",
    "message": "Une application complexe construite facilement",
    "files": [
      "src/components/Header/Header.js"
    ]
  },
  {
    "id": "header.banner.title",
    "defaultMessage": "React",
    "message": "React fr",
    "files": [
      "src/components/Header/Header.js"
    ]
  },

...
```

* import 'react-intl' Locale and add it to ```addLocaleData```

```
/src/client.js
```

import 

```
...
import fr from 'react-intl/locale-data/fr';`
[en, cs, fr].forEach(addLocaleData);

```

* Declare default Locales in ```config.js```

```
export const locales = ['en', 'cs', 'fr'];
```

That's all !
