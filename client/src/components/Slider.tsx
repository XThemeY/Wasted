import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Link } from 'react-router-dom';
import Autoplay from 'embla-carousel-autoplay';
import PosterLoader from '@/components/loaders/Posterloader';
import PosterRating from './PosterRating';

const Slider = ({ items, title }) => {
  return (
    <section>
      <h3 className="text-2xl ">{title}</h3>
      <hr className=" mb-2 h-[2px] border-0 bg-gradient-to-r from-pink-500 via-red to-95%" />
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3000,
          }),
        ]}
      >
        <CarouselContent className="-ml-1 md:-ml-2">
          {items.map((item) => (
            <CarouselItem
              key={item._id}
              className=" pl-1 md:basis-1/2 md:pl-2 lg:basis-1/5"
            >
              <Link
                className="relative"
                to={
                  item.type === 'movie'
                    ? `/movies/${item.id}`
                    : `/shows/${item.id}`
                }
              >
                <img
                  className="rounded-lg "
                  src={
                    `http://localhost:5000/public/media/m` + item.images.ru ||
                    item.images.en
                  }
                  alt={item.title_original}
                />
                <PosterRating item={item} />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default Slider;
