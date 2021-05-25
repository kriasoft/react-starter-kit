/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CurrentUser_me = {
    readonly id: string;
    readonly email: string | null;
    readonly name: string | null;
    readonly picture: {
        readonly url: string | null;
    } | null;
    readonly " $refType": "CurrentUser_me";
};
export type CurrentUser_me$data = CurrentUser_me;
export type CurrentUser_me$key = {
    readonly " $data"?: CurrentUser_me$data;
    readonly " $fragmentRefs": FragmentRefs<"CurrentUser_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CurrentUser_me",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "email",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Picture",
      "kind": "LinkedField",
      "name": "picture",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "url",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
};
(node as any).hash = 'b4e7aa53bbab826001cae3fd1530b046';
export default node;
