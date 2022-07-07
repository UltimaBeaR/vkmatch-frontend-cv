import PhotoController from './Controllers/PhotoController';
import UserDistributionController from './Controllers/UserDistributionController';
import MatchPreferencesController from './Controllers/MatchPreferencesController';
import AccountController from './Controllers/AccountController';
import UserViewPageController from './Controllers/UserViewPageController';

const account = new AccountController();
const matchPreferences = new MatchPreferencesController();
const photo = new PhotoController();
const userDistribution = new UserDistributionController();
const userViewPageController = new UserViewPageController();

export {
    account,
    matchPreferences,
    photo,
    userDistribution,
    userViewPageController
};