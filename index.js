const glob = require('glob');
const semver = require('semver');

module.exports = isOnSnykVulnDB;
module.exports.getVulnPackagesList = getVulnPackagesList;

function isOnSnykVulnDB(packageName, version){

	return getVulnFiles(packageName).then(paths => {
		return paths.map(toVulnarableRanges).filter(fitWithGivenVersion).length !== 0;
	});

	function toVulnarableRanges(path){
		const json = require(`./${path}`);
		return json.semver.vulnerable;
	}

	function fitWithGivenVersion(range){
		console.log(range);
		return semver.satisfies(version, range);
	}

}

function getVulnFiles(packageName){
	return new Promise((resolve, reject) => {

		glob(`node_modules/@snyk/vulndb/data/npm/${packageName}/*/data.json`, (err, paths) => {
			if (err) return reject(err);
			return resolve(paths);
		});

	});
}

function getVulnPackagesList(){
  return new Promise((resolve, reject) => {

	  glob('node_modules/@snyk/vulndb/data/npm/*', (err, paths) => {
		  if (err) return reject(err);
		  return resolve(paths.map(packageNames));
	  });

  });

	function packageNames(path){
	  return path.replace('node_modules/@snyk/vulndb/data/npm/', '');
	}

}