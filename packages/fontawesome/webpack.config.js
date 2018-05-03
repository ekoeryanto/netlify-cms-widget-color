const targetDir = {
  var: '.',
  umd: 'umd/v1',
  umd2: 'umd',
  commonjs: 'cjs/v1',
  commonjs2: 'cjs',
}

module.exports = (env, args) => {
  const lib = args.libraryTarget || 'var'
  const prod = args.mode === 'production'

  const main = () => ({
    devtool: prod ? 'source-map' : 'eval-source-map',
    externals: {
      ...cmx('netlify-cms-extended', 'CMS', lib),
      ...cmx('react-immutable-proptypes', ['CMS', 'ImmutablePropTypes'], lib),
      ...cmx('prop-types', ['CMS', 'PropTypes'], lib),
      ...cmx('immutable', ['CMS', 'Immutable'], lib),
      ...cmx('react', ['CMS', 'React'], lib),
      ...cmx('create-react-class', ['CMS', 'createReactClass'], lib),
      ...cmx('classnames', ['CMS', 'classNames'], lib),
      ...cmx('react-dom', ['CMS', 'ReactDOM'], lib),
    },
    output: {
      library: ['NetlifyCMSWidgetFontawesome'],
      libraryTarget: lib,
      filename: `${targetDir[lib] || lib || '.'}/[name].js`,
      umdNamedDefine: lib === 'umd' || undefined,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'source-map-loader',
          enforce: 'pre',
        },
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          loader: ['style-loader', 'css-loader'],
        },
      ],
    },
  })

  const single = main()
  single.entry = {
    Brands: './src/Brands',
    Regular: './src/Regular',
    Solid: './src/Solid',
  }
  single.output.library.push('[name]')

  return [main(), single]
}

function cmx (name, root, target) {
  const stringRoot = `${Array.isArray(root) ? root.join('.') : root}`
  switch (target) {
    case 'umd':
    case 'umd2':
      return {
        [name]: {
          root,
          commonjs: name,
          commonjs2: name,
          amd: name,
        },
      }
    case 'commonjs':
    case 'commonjs2':
      return {[name]: name}
    case 'window':
      return {[name]: {window: root}}
    default:
      return {[name]: stringRoot}
  }
}
