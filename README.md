# Package Version Bisect

Package Version Bisect is a tool inspired by git bisect that helps you identify which version of a package introduced a bug or regression in your project.

## Usage
Package Version Bisect works by following a process similar to git bisect. Here's how you can use it:

```bash
npx package-version-bisect --package <package-name> --good <good-version> --bad <bad-version>
```

From there you will be prompted to test different versions of the package and mark them as good or bad based on whether they exhibit the issue.

<img alt="A screenshot of a terminal to illustrate the prompts when using package-version-bisect" src="https://github.com/CarinaChenot/package-version-bisect/assets/16705167/0f8ee0c0-c8cf-4c0b-9741-c7c8fd660a47" height=80 />

## Reference
| Parameter    | Description                                                                                            | Required | Example                 |
|--------------|--------------------------------------------------------------------------------------------------------|----------|-------------------------|
| `--package` | The name of the package                                                                                | Yes      | `--package my-package`  |
| `--good`  | A known good version of the package                                                                    | Yes      | `--good 1.0.0`          |
| `--bad`  | A known bad version of the package                                                                     | Yes      | `--bad 1.2.0`           |
| `--install`  | Command to run instead of `npm install` (useful when using another package manager or devDependencies) | No       | `--install yarn add -D` |

## Future improvements

- Improve algorithm by prioritizing testing major versions
- Support for custom test commands for automated testing
- Automatically recognize package manager (npm, yarn, etc.) and devDependencies
- Support for private packages
- Add option to include pre-release versions like `3.0.2-rc.1` (currently only includes stable versions)

## Contributing
Contributions are welcome! If you encounter any issues or have suggestions for improvements, feel free to open an issue or submit a pull request on GitHub.

## License
This project is licensed under the [MIT License](LICENSE).
