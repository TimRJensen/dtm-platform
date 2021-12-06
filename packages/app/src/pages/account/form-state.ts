export interface FormState {
  email: string;
  password: string;
  confirmedPassword: string;
  firstName: string;
  lastName: string;
  city: string;
  region: string;
  country: string;
}

export type Actions = {
  type: "SET_VALUE";
  value: { key: keyof FormState; value: string };
};

export const reducer = function reducer(state: FormState, action: Actions) {
  switch (action.type) {
    case "SET_VALUE": {
      return { ...state, [action.value.key]: action.value.value };
    }
    default: {
      throw new Error();
    }
  }
};
