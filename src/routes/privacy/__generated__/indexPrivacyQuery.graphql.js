/**
 * This file was generated by:
 *   relay-compiler
 *
 * @providesModule indexPrivacyQuery.graphql
 * @generated SignedSource<<e0d8e0a4b2563b5ad44bfa0d2dba34d2>>
 * @relayHash c48724ee48e38e1a6378e685ce774b43
 * @flow
 * @nogrep
 */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';

*/

/* eslint-disable comma-dangle, quotes */

/*
query indexPrivacyQuery {
  me {
    ...Layout_me
    id
  }
}

fragment Layout_me on User {
  ...Header_me
}

fragment Header_me on User {
  ...Navigation_me
}

fragment Navigation_me on User {
  email
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "indexPrivacyQuery",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": null,
        "concreteType": "User",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Layout_me",
            "args": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "indexPrivacyQuery",
  "query": {
    "argumentDefinitions": [],
    "kind": "Root",
    "name": "indexPrivacyQuery",
    "operation": "query",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": null,
        "concreteType": "User",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "email",
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "query indexPrivacyQuery {\n  me {\n    ...Layout_me\n    id\n  }\n}\n\nfragment Layout_me on User {\n  ...Header_me\n}\n\nfragment Header_me on User {\n  ...Navigation_me\n}\n\nfragment Navigation_me on User {\n  email\n}\n"
};

module.exports = batch;
