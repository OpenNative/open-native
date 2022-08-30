const fs = require('fs')
const readline = require('readline')

// Params used in the template project
const DEFAULT_NAME = 'react-native-module-template'
const DEFAULT_SHORT_NAME = 'RNModuleTemplate'
const DEFAULT_URL =
  'https://github.com/demchenkoalex/react-native-module-template#readme'
const DEFAULT_GIT_URL =
  'https://github.com/demchenkoalex/react-native-module-template.git'
const DEFAULT_AUTHOR_NAME = 'Alex Demchenko'
const DEFAULT_AUTHOR_EMAIL = 'alexdemchenko@yahoo.com'

// Questions list
const QUESTION_NAME = `Enter library name (use kebab-case) (default ${DEFAULT_NAME}): `
const QUESTION_SHORT_NAME = `Enter library short name (used to name Swift and Kotlin classes, use PascalCase) (default ${DEFAULT_SHORT_NAME}): `
const QUESTION_URL = `Enter library homepage (default ${DEFAULT_URL}): `
const QUESTION_GIT_URL = `Enter library git url (default ${DEFAULT_GIT_URL}): `
const QUESTION_AUTHOR_NAME = `Enter author name (default ${DEFAULT_AUTHOR_NAME}): `
const QUESTION_AUTHOR_EMAIL = `Enter author email (default ${DEFAULT_AUTHOR_EMAIL}): `

// Pass `js-only` parameter to remove native code
const jsOnly = process.argv.slice(2).includes('js-only')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

if (jsOnly) {
  // JS only mode
  // Remove `QUESTION_SHORT_NAME` since it is used only in the native code
  // Remove `QUESTION_GIT_URL` since in it used only in the .podspec file
  rl.question(QUESTION_NAME, (name) => {
    rl.question(QUESTION_URL, (url) => {
      rl.question(QUESTION_AUTHOR_NAME, (authorName) => {
        rl.question(QUESTION_AUTHOR_EMAIL, (authorEmail) => {
          renameFiles(
            name || undefined,
            undefined,
            url || undefined,
            undefined,
            authorName || undefined,
            authorEmail || undefined
          )
          rl.close()
        })
      })
    })
  })
} else {
  // Normal mode
  // All questions
  rl.question(QUESTION_NAME, (name) => {
    rl.question(QUESTION_SHORT_NAME, (shortName) => {
      rl.question(QUESTION_URL, (url) => {
        rl.question(QUESTION_GIT_URL, (gitUrl) => {
          rl.question(QUESTION_AUTHOR_NAME, (authorName) => {
            rl.question(QUESTION_AUTHOR_EMAIL, (authorEmail) => {
              renameFiles(
                name || undefined,
                shortName || undefined,
                url || undefined,
                gitUrl || undefined,
                authorName || undefined,
                authorEmail || undefined
              )
              rl.close()
            })
          })
        })
      })
    })
  })
}

const replaceDefaultShortName = (data, shortName) => {
  return data.replace(new RegExp(DEFAULT_SHORT_NAME, 'g'), shortName)
}

const renameFiles = (
  name = DEFAULT_NAME,
  shortName = DEFAULT_SHORT_NAME,
  url = DEFAULT_URL,
  gitUrl = DEFAULT_GIT_URL,
  authorName = DEFAULT_AUTHOR_NAME,
  authorEmail = DEFAULT_AUTHOR_EMAIL
) => {
  try {
    // Clear `README.md`
    fs.writeFileSync('README.md', '')

    if (jsOnly) {
      // JS only mode
      // Remove .podspec
      fs.unlinkSync(`${DEFAULT_NAME}.podspec`)
    } else {
      // Normal mode
      // Rename .podspec and replace git url
      fs.renameSync(`${DEFAULT_NAME}.podspec`, `${name}.podspec`)
      const podspecData = fs.readFileSync(`${name}.podspec`).toString()
      const newPodspecData = podspecData.replace(DEFAULT_GIT_URL, gitUrl)
      fs.writeFileSync(`${name}.podspec`, newPodspecData)
    }

    // Modify `package.json`
    const packageData = fs.readFileSync('package.json').toString()
    let newPackageData = packageData
      .replace(DEFAULT_URL, url)
      .replace(new RegExp(DEFAULT_NAME, 'g'), name)
      .replace(DEFAULT_AUTHOR_NAME, authorName)
      .replace(DEFAULT_AUTHOR_EMAIL, authorEmail)
      .replace(/"description": ".+"/g, '"description": ""')
      .replace(/"version": ".+"/g, '"version": "1.0.0"')
    if (jsOnly) {
      // JS only mode
      // Supply only `lib` folder in `package.json`
      newPackageData = newPackageData.replace(
        /"files": \[.+\],/s,
        '"files": [\n    "lib"\n  ],'
      )
    }
    fs.writeFileSync('package.json', newPackageData)

    // Modify author in `LICENSE`
    const licenseData = fs.readFileSync('LICENSE').toString()
    const newLicenseData = licenseData.replace(DEFAULT_AUTHOR_NAME, authorName)
    fs.writeFileSync('LICENSE', newLicenseData)

    // Modify example's `tsconfig.json`
    const tsConfigData = fs.readFileSync('example/tsconfig.json').toString()
    const newTsConfigData = tsConfigData.replace(DEFAULT_NAME, name)
    fs.writeFileSync('example/tsconfig.json', newTsConfigData)

    if (jsOnly) {
      // JS only mode
      // Remove native modules from `index.tsx`
      const indexData = fs.readFileSync('src/index.tsx').toString()
      const newIndexData = indexData
        .replace(
          new RegExp(
            `\nexport default NativeModules.${DEFAULT_SHORT_NAME}Module\n`,
            'g'
          ),
          ''
        )
        .replace('NativeModules, ', '')
      fs.writeFileSync('src/index.tsx', newIndexData)

      // Remove native modules from `App.tsx`
      const appData = fs.readFileSync('example/src/App.tsx').toString()
      const newAppData = appData
        .replace(`${DEFAULT_SHORT_NAME}Module, `, '')
        .replace(`${DEFAULT_SHORT_NAME}Module`, "''")
        .replace(DEFAULT_NAME, name)
      fs.writeFileSync('example/src/App.tsx', newAppData)

      // Remove native folders
      fs.rmdirSync('ios', { recursive: true })
      fs.rmdirSync('android', { recursive: true })
    } else {
      // Normal mode
      // Rename native modules in `index.tsx`
      const indexData = fs.readFileSync('src/index.tsx').toString()
      const newIndexData = replaceDefaultShortName(indexData, shortName)
      fs.writeFileSync('src/index.tsx', newIndexData)

      // Rename native modules in `App.tsx`
      const appData = fs.readFileSync('example/src/App.tsx').toString()
      const newAppData = replaceDefaultShortName(appData, shortName).replace(
        DEFAULT_NAME,
        name
      )
      fs.writeFileSync('example/src/App.tsx', newAppData)

      // Rename and modify .xcscheme file
      fs.renameSync(
        `ios/${DEFAULT_SHORT_NAME}Module.xcodeproj/xcshareddata/xcschemes/${DEFAULT_SHORT_NAME}Module.xcscheme`,
        `ios/${DEFAULT_SHORT_NAME}Module.xcodeproj/xcshareddata/xcschemes/${shortName}Module.xcscheme`
      )
      const schemeData = fs
        .readFileSync(
          `ios/${DEFAULT_SHORT_NAME}Module.xcodeproj/xcshareddata/xcschemes/${shortName}Module.xcscheme`
        )
        .toString()
      const newSchemeData = replaceDefaultShortName(schemeData, shortName)
      fs.writeFileSync(
        `ios/${DEFAULT_SHORT_NAME}Module.xcodeproj/xcshareddata/xcschemes/${shortName}Module.xcscheme`,
        newSchemeData
      )

      // Rename .xcodeproj folder
      fs.renameSync(
        `ios/${DEFAULT_SHORT_NAME}Module.xcodeproj`,
        `ios/${shortName}Module.xcodeproj`
      )

      // Modify `project.pbxproj`
      const projectData = fs
        .readFileSync(`ios/${shortName}Module.xcodeproj/project.pbxproj`)
        .toString()
      const newProjectData = replaceDefaultShortName(
        projectData,
        shortName
      ).replace(DEFAULT_AUTHOR_NAME, authorName)
      fs.writeFileSync(
        `ios/${shortName}Module.xcodeproj/project.pbxproj`,
        newProjectData
      )

      // Rename and modify bridging header .h file
      fs.renameSync(
        `ios/${DEFAULT_SHORT_NAME}Module-Bridging-Header.h`,
        `ios/${shortName}Module-Bridging-Header.h`
      )

      // Rename and modify .m file
      fs.renameSync(
        `ios/${DEFAULT_SHORT_NAME}Module.m`,
        `ios/${shortName}Module.m`
      )
      const implementationData = fs
        .readFileSync(`ios/${shortName}Module.m`)
        .toString()
      const newImplementationData = replaceDefaultShortName(
        implementationData,
        shortName
      ).replace(DEFAULT_AUTHOR_NAME, authorName)
      fs.writeFileSync(`ios/${shortName}Module.m`, newImplementationData)

      // Rename and modify .swift file
      fs.renameSync(
        `ios/${DEFAULT_SHORT_NAME}Module.swift`,
        `ios/${shortName}Module.swift`
      )
      const swiftData = fs
        .readFileSync(`ios/${shortName}Module.swift`)
        .toString()
      const newSwiftData = replaceDefaultShortName(
        swiftData,
        shortName
      ).replace(DEFAULT_AUTHOR_NAME, authorName)
      fs.writeFileSync(`ios/${shortName}Module.swift`, newSwiftData)

      // Generate Android package name from auther and module names
      const androidPackageAuthorName = authorName
        .replace(/\s/g, '')
        .toLowerCase()
      const androidPackageModuleName = name.replace(/-/g, '').toLowerCase()
      const androidPackageName = `com.${androidPackageAuthorName}.${androidPackageModuleName}`

      // Generate current Android package name from default author and module names
      const defaultAndroidPackageAuthorName = DEFAULT_AUTHOR_NAME.replace(
        /\s/g,
        ''
      ).toLowerCase()
      const defaultAndroidPackageModuleName = DEFAULT_NAME.replace(
        /-/g,
        ''
      ).toLowerCase()
      const defaultAndroidPackageName = `com.${defaultAndroidPackageAuthorName}.${defaultAndroidPackageModuleName}`

      // Rename package in `AndroidManifest.xml`
      const manifestData = fs
        .readFileSync('android/src/main/AndroidManifest.xml')
        .toString()
      const newManifestData = manifestData.replace(
        defaultAndroidPackageName,
        androidPackageName
      )
      fs.writeFileSync('android/src/main/AndroidManifest.xml', newManifestData)

      // Rename package folders
      fs.renameSync(
        `android/src/main/java/com/${defaultAndroidPackageAuthorName}`,
        `android/src/main/java/com/${androidPackageAuthorName}`
      )
      fs.renameSync(
        `android/src/main/java/com/${androidPackageAuthorName}/${defaultAndroidPackageModuleName}`,
        `android/src/main/java/com/${androidPackageAuthorName}/${androidPackageModuleName}`
      )

      // Rename and modify Kotlin files
      fs.renameSync(
        `android/src/main/java/com/${androidPackageAuthorName}/${androidPackageModuleName}/${DEFAULT_SHORT_NAME}Module.kt`,
        `android/src/main/java/com/${androidPackageAuthorName}/${androidPackageModuleName}/${shortName}Module.kt`
      )
      const kotlinModuleData = fs
        .readFileSync(
          `android/src/main/java/com/${androidPackageAuthorName}/${androidPackageModuleName}/${shortName}Module.kt`
        )
        .toString()
      const newKotlinModuleData = replaceDefaultShortName(
        kotlinModuleData,
        shortName
      ).replace(defaultAndroidPackageName, androidPackageName)
      fs.writeFileSync(
        `android/src/main/java/com/${androidPackageAuthorName}/${androidPackageModuleName}/${shortName}Module.kt`,
        newKotlinModuleData
      )
      fs.renameSync(
        `android/src/main/java/com/${androidPackageAuthorName}/${androidPackageModuleName}/${DEFAULT_SHORT_NAME}Package.kt`,
        `android/src/main/java/com/${androidPackageAuthorName}/${androidPackageModuleName}/${shortName}Package.kt`
      )
      const kotlinPackageData = fs
        .readFileSync(
          `android/src/main/java/com/${androidPackageAuthorName}/${androidPackageModuleName}/${shortName}Package.kt`
        )
        .toString()
      const newKotlinPackageData = replaceDefaultShortName(
        kotlinPackageData,
        shortName
      ).replace(defaultAndroidPackageName, androidPackageName)
      fs.writeFileSync(
        `android/src/main/java/com/${androidPackageAuthorName}/${androidPackageModuleName}/${shortName}Package.kt`,
        newKotlinPackageData
      )

      // Modify example's `project.pbxproj`
      const exampleProjectData = fs
        .readFileSync('example/ios/example.xcodeproj/project.pbxproj')
        .toString()
      const newExampleProjectData = replaceDefaultShortName(
        exampleProjectData,
        shortName
      )
      fs.writeFileSync(
        'example/ios/example.xcodeproj/project.pbxproj',
        newExampleProjectData
      )

      // Modify `settings.gradle`
      const settingsData = fs
        .readFileSync('example/android/settings.gradle')
        .toString()
      const newSettingsData = settingsData.replace(
        new RegExp(DEFAULT_NAME, 'g'),
        name
      )
      fs.writeFileSync('example/android/settings.gradle', newSettingsData)

      // Modify `build.gradle`
      const buildData = fs
        .readFileSync('example/android/app/build.gradle')
        .toString()
      const newBuildData = buildData.replace(
        new RegExp(DEFAULT_NAME, 'g'),
        name
      )
      fs.writeFileSync('example/android/app/build.gradle', newBuildData)

      // Modify `MainApplication.kt`
      const mainApplicationData = fs
        .readFileSync(
          'example/android/app/src/main/java/com/example/MainApplication.kt'
        )
        .toString()
      const newMainApplicationData = replaceDefaultShortName(
        mainApplicationData,
        shortName
      ).replace(defaultAndroidPackageName, androidPackageName)
      fs.writeFileSync(
        'example/android/app/src/main/java/com/example/MainApplication.kt',
        newMainApplicationData
      )
    }
  } catch (err) {
    console.log(err)
  }
}
