import { groq } from "next-sanity";

export const navQuery = groq`*[_type == "nav"][0] {
    cta[],
    pages[] {
      title,
      link,
      visible,
      page_subnav,
      page_sections,
      id,
      page_submenu {
       clubs[]->  {
          name,
          link,
          image
        },
         links
      }
    }
  }`;

export const clubsQuery = groq`*[_type == "clubs"] | order(name asc)`;
export const generalQuery = groq`*[_type == "general"][0]`;

export interface generalResponse {
  title: string;
  primary_color: {
    hex: string;
  };
  secondary_color: {
    hex: string;
  };
  logo: object;
  second_logo: object;
}
interface SubNav {
  redirect_link: string;
  section_reference: string;
  title: string;
}

interface Club {
  _type: string;
  _ref: string;
}

interface Link {
  _type: string;
  title: string;
  url: string;
}
interface SubMenu {
  clubs: Club[];
  links: Link[];
}
interface CtaItem {
  title: string;
  link: string;
}

interface Section {
  title: string;
  id: string;
  visible: boolean;
  blockContent: BlockContent;
  description: string;
  tagline: string;
  image: {
    asset: {
      _ref: string;
    };
  };
  cta: CtaItem[];
}

interface Page {
  title: string;
  link: string;
  id: string;
  visible: boolean;
  page_subnav: SubNav[];
  page_submenu: SubMenu[];
  page_sections: Section[];
}
export interface navResponse {
  cta: Array<object>;
  pages: Page[];
}

export const bannerQuery = groq`*[_type == "banner"][0] {
 background,
 items[] -> {
      _type,
      title,
      slug,
      preview,
      category->{
        title
      },
      short_description, 
      video {
        url,
       preview
      }
}       
}`;

interface Author {
  _type: "reference";
  _ref: string;
  name: string;
  position: string;
}

interface BlockContent {
  _type: "block";
  children: Array<{
    _type: "span";
    text: string;
    marks: [];
  }>;
}

export interface News {
  _type: "news";
  _id: string;
  title: string;
  _createdAt: string;
  _updatedAt: string;
  slug: {
    current: string;
  };
  preview: {
    _type: "image";
    asset: {
      _ref: string;
    };
  };
  category: Category;
  author: Author;
  blockContent: BlockContent[];
  short_description: string;
}

export interface Video {
  _type: "video";
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: {
    current: string;
  };
  category: Category;
  author: Author;
  video: {
    url: string;
    preview: {
      _type: "image";
      asset: {
        _ref: string;
      };
    };
  };
  preview?: {
    _type: "image";
    asset: {
      _ref: string;
    };
  };
  short_description: string;
}

export interface BannerResponse {
  background: {
    asset: {
      _ref: string;
    };
  };
  items: Array<News | Video>;
}

export const sponsorsQuery = groq`*[_type == "sponsors"]`;
export interface Sponsor {
  _id: string;
  kind: string;
  link: string;
  image: {
    _type: "image";
    asset: {
      _ref: string;
    };
  };
}
export const newsQuery = groq`*[_type == "news"] {
     _type,
     _id,
     _createdAt,
     _updatedAt,
      title,
      slug,
      preview,
      category->{
        title
      },
      short_description, 
      video {
        url,
       preview
      }
}`;
export const videoQuery = groq`*[_type == "video"] {
     _type,
         _id,
      title,
      slug,
      _createdAt,
      _updatedAt,
      category->{
        title
      },
      short_description, 
      video {
        url,
       preview
      }
}`;
export const footerQuery = groq`*[_type == "footer"][0]`;
export const socialQuery = groq`*[_type == "social"]`;
export const policiesQuery = groq`*[_type == "policies"]`;
export const categoriesQuery = groq`*[_type == "categories"]`;
export interface Category {
  _id: string;
  _type: "reference";
  _ref: string;
  title: string;
  image: {
    _type: "image";
    asset: {
      _ref: string;
    };
  };
}
export const policyQuery = groq`*[_type == "policies" && slug.current == $title][0]`;
export const articleQuery = groq`*[_type == "news" && slug.current == $title][0]{
        ..., 
        author->{
        name, 
        position
        } 
}`;
export const videoSingleQuery = groq`*[_type == "video" && slug.current == $title][0]{
        ..., 
        author->{
        name, 
        position
        } 
}`;
export interface PolicyResponse {
  title: string;
  blockContent: BlockContent[];
}
export const playersQuery = groq`*[_type == "players"] | order(last_name asc){
        _id,
        _createdAt,
        _updatedAt,
        first_name,
        last_name,
        profile,
        nationality,
        number,
           related_seasons[]->{
        _key,
        season,
    },
        club-> {
          name,
          link,
          image
        },
        position,
        date_of_birth,
        height,
        season_stats[]->{
          season->{
            season
          },
          club->{
            name,
            link,
            image
          },
          appearances,
          goals,
          assists,
          clean_sheets
        },
        social_media[] {
          platform_name,
          url,
          icon
        }
      }`;

export const playerQuery = (firstName: string, lastName: string) => {
  const query = groq`*[_type == "players" && first_name == "${
    firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
  }" && last_name == "${
    lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()
  }"] | order(_createdAt desc)[0] {
    _id,
    _createdAt,
    _updatedAt,
    first_name,
    last_name,
    profile,
    nationality,
    number,
    club-> {
      name,
      link,
      image
    },
    position,
    related_seasons[]->{
        _key,
        season,
    },
    date_of_birth,
    height,
    season_stats[] {
      season->{
        season
      },
      club->{
        name,
        link,
        image
      },
      appearances,
      goals,
      assists,
      clean_sheets
    },
    social_media[] {
      platform_name,
      url,
      icon
    }
  }`;

  return query;
};
export const seasonsQuery = `*[_type == "seasons"] {
      _id,
      season,
      main,
      league_table[] {
          _key,
          points,
          gf,
          ga,
          played,
          won,
          drawn,
          lost,
          club->{
            _id,
            _ref,
            _type,
            name,
            link,
            image
          }
      },
      matchweeks[] {
       _id,
        name,
        startDate,
        endDate,
        days[] {
         date,
         fixtures[] {
           _key,
         away_club -> {
            _id,
            name,
            link,
            image
         },
         home_club -> {
            _id,
            name,
            link,
            image
          },
          scheduled_date_time,
         score {
        away_score,
        home_score
          },
       live_mode,
       location
      }
         }
      }
     
    }`;
interface Club {
  _id: string;
  name: string;
  link: string; // Adjust type if link has a specific structure
  image: string; // Adjust type if image has a specific structure
}

export interface Fixture {
  _key: string;
  away_club: Club;
  home_club: Club;
  location: string;
  scheduled_date_time: string; // Assuming this is a string in ISO format
  score: {
    away_score: number;
    home_score: number;
  };
  live_mode: boolean; // Assuming live_mode is boolean
}

interface MatchweekDay {
  date: string; // Assuming this is a string in ISO format
  fixtures: Fixture[];
}

export interface Matchweek {
  _id: string;
  name: string;
  startDate: string; // Assuming this is a string in ISO format
  endDate: string; // Assuming this is a string in ISO format
  days: MatchweekDay[];
}

interface LeagueTableRow {
  _key: string;
  points: number;
  gf: number;
  ga: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  club: Club;
}

export interface Season {
  _id: string;
  season: string;
  main: boolean;
  league_table: LeagueTableRow[];
  matchweeks: Matchweek[];
}
export interface ClubItem {
  name: string;
  link: string;
  image: {
    _type: "image";
    asset: {
      _ref: string;
    };
  };
}
interface SeasonStat {
  season: string;
  club: Club;
  appearances: number;
  goals: number;
  assists: number;
  clean_sheets: number;
}

interface SocialMedia {
  platform_name: string;
  url: string;
  icon: {
    _type: "image";
    asset: {
      _ref: string;
    };
  };
}

export interface Player {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  first_name: string;
  last_name: string;
  related_seasons: Season[];
  profile: {
    _type: "image";
    asset: {
      _ref: string;
    };
  };
  nationality: string;
  number: number;
  club: Club;
  position: string;
  date_of_birth: string;
  height: number;
  season_stats: SeasonStat[];
  social_media: SocialMedia[];
}

// Function to get the query for related news and videos
export const relatedNewsAndVideosQuery = (playerId: string) => {
  return groq`{
    "news": *[_type == "news" && references("${playerId}")]{
       _type,
     _id,
     _createdAt,
     _updatedAt,
      title,
      slug,
      preview,
      category->{
        title
      },
      short_description, 
      video {
        url,
       preview
      }
    },
    "videos": *[_type == "video" && references("${playerId}")]{
     _type,
         _id,
      title,
      slug,
      _createdAt,
      _updatedAt,
      category->{
        title
      },
      short_description, 
      video {
        url,
       preview
      }
    }
  }`;
};
