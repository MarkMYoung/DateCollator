// Use of this file circumvents module errors:
//	* throw new ERR_REQUIRE_ESM(filename, parentPath, packageJsonPath);
//	* Error [ERR_REQUIRE_ESM]: Must use import to load ES Module:
//	* require() of ES modules is not supported.
import Jasmine from 'jasmine';
let jasmine = new Jasmine();
jasmine.loadConfigFile( 'spec/config/jasmine.json' );
// jasmine.configureDefaultReporter({ ... });
jasmine.execute();