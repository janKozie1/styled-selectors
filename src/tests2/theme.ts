export type Theme = {
    colors: {
        main: {
            blue: {
                dark: {
                    2: string;
                };
            };
            red: {
                light: {
                    2: string;
                };
            };
        };
    };
    something: string;
    size: {
        toolbar: {
            big: number;
            small: number;
        };
    };
};

export const theme: Theme = {
    colors: {
        main: {
            blue: {
                dark: {
                    1: '00008B',
                },
            },
            red: {
                light: {
                    2: 'F8665E'
                }
            }
        },
    },
    something: 'some value',
    size: {
        toolbar: {
            big: 5,
            small: 1
        }
    }
};
