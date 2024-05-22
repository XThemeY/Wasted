export const moviePopFields = {
  path: 'countriesId genresId production_companiesId tagsId director.person cast.person',
  select: '-movies -shows',
};

export const showPopFields = {
  path: 'countriesId genresId production_companiesId tagsId platformsId creators.person cast.person seasons',
  select: '-movies -shows',
};
