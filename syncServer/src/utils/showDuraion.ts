import { TVShow } from '#database/models/index.js';

export async function setShowDuration(showId: number): Promise<void> {
  const show = await TVShow.findOne(
    { id: showId },
    'number_of_episodes seasons',
  ).populate({
    path: 'seasons',
    select: 'season_number episodes',
    populate: {
      path: 'episodes',
      model: 'Episode',
      select: 'duration',
    },
  });
  const seasons = show.seasons;
  let total_duration = 0;
  for (const element of seasons) {
    const episodes = element.episodes;
    if (element.season_number >= 1) {
      const season_duration = episodes.reduce(
        (sum, item) => sum + item.duration,
        0,
      );
      total_duration += season_duration;
    }
  }
  const episode_duration = Math.trunc(total_duration / show.number_of_episodes);
  show.episode_duration = episode_duration || 0;
  show.total_episodes_time = total_duration || 0;
  await show.save();
}
