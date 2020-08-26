module.exports = {
    purge: {
        enabled: false
    },
    theme: {
        extend: {
            colors: {
                customgreen: '#1DB954',
                background: '#f5f5f5',
                backgroundDark: '#ebebeb',
                text: '#2b2c34',
            },
            width: {
                '9/10': '90%'
            },
            height: {
                '85': '85%',
                
            },
            gridTemplateRows: {
                'pancake': 'auto 1fr auto'
            },
        },
        minHeight: {
            '0': '0',
            '1/4': '25%',
            '1/2': '50%',
            '3/4': '75%',
            'full': '100%',
        },
        maxHeight: {
            '1/3': '33%',
            '1/2': '50%',
            'full': '100%'
        }
    },
    variants: {
    },
    plugins: [],
};
