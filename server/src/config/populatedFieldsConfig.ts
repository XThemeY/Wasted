export const moviePopFields = {
  path: 'countriesId genresId production_companiesId tagsId director.person cast.person',
  select: '-movies -shows',
};

export const showPopFields = {
  path: 'countriesId genresId tagsId platformsId production_companiesId creators.person cast.person',
  select: '-movies -shows',
};
