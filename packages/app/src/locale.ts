export default {
  "en/US": {
    components: {
      AppNavBar: {
        ArtiFACT: "ArtiFACT",
        signIn: "sign in",
        signOut: "sign out",
        dashboard: "dashboard",
      },
      ArtifactPanel: {
        mainCategory: "Main category:",
        subCategory: "Sub category:",
        period: "Period:",
        tags: "Tags:",
        comment: "comment",
      },
      AppPanel: {
        categories: "CATEGORIES",
        popular: "popular",
      },
      Button: {
        submit: "submit",
        cancel: "cancel",
      },
      MessageHeader: {
        edit: "edit",
        delete: "delete",
        report: "report",
        ban: "ban",
      },
      PostFooter: {
        reply: "reply",
        upvote: "upvote",
      },
      SearchResultPanel: {
        mainCategory: "Main category:",
        subCategory: "Sub category:",
        period: "Period:",
      },
    },
    pages: {
      account: {
        section: "account",
        create: {
          label: "new",
          email: "Email",
          password: "Password",
          confirmPassword: "Confirm password",
          firstName: "Firstname",
          lastName: "Lastname",
          city: "City",
          region: "Region",
        },
        profile: {
          label: "dashboard",
          email: "Email",
          password: "New password",
          confirmPassword: "Confirm new password",
          firstName: "Firstname",
          lastName: "Lastname",
          city: "City",
          region: "Region",
        },
        success: {
          emoji: "(>‿◠)✌",
          success:
            "Your account was succesfully created, but in order to login, it needs to be verified.",
          verify: (email: string) =>
            `An email has been sent to ${email} with a verification link.`,
          wait: "While you wait for the email to arrive, consider taking the time to add some of your interests below:",
        },
        verified: {
          section: "account",
          label: "new",
          emoji: "ヽ(•‿•)ノ",
          verified: "Your account has been verified.",
        },
      },
      blogs: {
        section: "artifact",
      },
      login: {
        section: "login",
        password: "Password",
        email: "Email",
        loginExisting: "Login with an existing login:",
        loginWith: (method: string) => `Login with ${method}`,
        create: "Don't have an account yet? Create one ",
        link: "here",
      },
      search: {
        section: "search",
      },
      categories: {
        section: "category",
      },
      error: {
        [409]: {
          emoji: "(✖﹏✖)",
          message: "The provided email is already registered.",
        },
        [404]: {
          emoji: "¯\\_(ツ)_/¯",
          message: "Nothing here.",
        },
        [500]: {
          emoji: "(✖﹏✖)",
          message: "Something unexpected happened.",
        },
      },
      landing: {},
    },
  },
  "dk/DK": {
    components: {
      AppNavBar: {
        ArtiFACT: "ArtiFACT",
        signIn: "log ind",
        signOut: "log ud",
        dashboard: "kontrolpanel",
      },
      ArtifactPanel: {
        mainCategory: "Hoved kategori:",
        subCategory: "Under kategori:",
        period: "Periode:",
        tags: "Tags:",
        comment: "kommentar",
      },
      AppPanel: {
        categories: "KATEGORIER",
        popular: "populær",
      },
      Button: {
        submit: "indsend",
        cancel: "annuller",
      },
      MessageHeader: {
        edit: "rediger",
        delete: "slet",
        report: "rapporter",
        ban: "ban",
      },
      PostFooter: {
        reply: "svar",
        upvote: "upvote",
      },
      SearchResultPanel: {
        mainCategory: "Hoved kategori:",
        subCategory: "Under kategori:",
        period: "Periode:",
      },
    },
    pages: {
      account: {
        section: "konto",
        create: {
          label: "opret",
          email: "Email",
          password: "Kodeord",
          confirmPassword: "Bekræft kodeord",
          firstName: "Fornavn",
          lastName: "Efternavn",
          city: "By",
          region: "Lokalitet",
        },
        profile: {
          label: "kontrolpanel",
          email: "Email",
          password: "Nyt kodeord",
          confirmPassword: "Bekræft nyt kodeord",
          firstName: "Fornavn",
          lastName: "Efternavn",
          city: "By",
          region: "Lokalitet",
        },
        success: {
          emoji: "(>‿◠)✌",
          success:
            "Din konto er nu oprettet, men for at logge ind skal den  bekræftes.",
          verify: (email: string) =>
            `En email er blevet send til ${email} med et bekræftelses link.`,
          wait: "Imens du venter på emailen, overvej at tilføje nogle af dine interesser herunder:",
        },
        verified: {
          section: "konto",
          label: "opret",
          emoji: "ヽ(•‿•)ノ",
          verified: "Din konto er nu bekræftet.",
        },
      },
      blogs: {
        section: "genstand",
      },
      login: {
        section: "log ind",
        password: "Kodeord",
        email: "Email",
        loginExisting: "Log ind med en eksisterende konto:",
        loginWith: (method: string) => `Login med ${method}`,
        create: "Har du ikke end konto endnu? Opret en ",
        link: "her",
      },
      search: {
        section: "søg",
      },
      categories: {
        section: "kategori",
      },
      error: {
        [409]: {
          emoji: "(✖﹏✖)",
          message: "Den indtastede email er allerde registreret",
        },
        [404]: {
          emoji: "¯\\_(ツ)_/¯",
          message: "Intet her.",
        },
        [500]: {
          emoji: "(✖﹏✖)",
          message: "Der skete noget uventet.",
        },
      },
      landing: {},
    },
  },
};
