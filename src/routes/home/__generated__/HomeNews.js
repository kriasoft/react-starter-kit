

/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: HomeNews
// ====================================================

export type HomeNews_reactjsGetAllNews = {
  __typename: "ReactJSNewsItem",
  /**
   * The news item's title
   */
  title: string,
  /**
   * A direct link URL to this news item on reactjsnews.com
   */
  link: string,
  /**
   * News article in HTML format
   */
  content: string,
};

export type HomeNews_networkStatus = {
  __typename: "NetworkStatus",
  isConnected: boolean,
};

export type HomeNews = {
  /**
   * Retrieves the latest ReactJS News
   */
  reactjsGetAllNews: Array<HomeNews_reactjsGetAllNews>,
  networkStatus: HomeNews_networkStatus,
};

/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================