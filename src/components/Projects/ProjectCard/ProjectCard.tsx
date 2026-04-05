import React from 'react';
import { Link } from 'react-router-dom';
import './ProjectCard.scss';

interface DemoCardProps {
  id: number;
  title: string;
  category: string;
  demonstrates: string;
  description: string;
  tags: string[];
  route: string;
  codeLink: string;
}

const ProjectCard: React.FC<DemoCardProps> = ({
  title,
  category,
  demonstrates,
  description,
  tags,
  route,
  codeLink,
}) => {
  return (
    <article className="demo-card">
      <div className="demo-card__header">
        <span className={`demo-card__category demo-card__category--${category.toLowerCase().replace('-', '')}`}>
          {category}
        </span>
        <h2 className="demo-card__title">{title}</h2>
        <p className="demo-card__demonstrates">{demonstrates}</p>
      </div>

      <p className="demo-card__description">{description}</p>

      <div className="demo-card__tags">
        {tags.map(tag => (
          <span key={tag} className="demo-card__tag">{tag}</span>
        ))}
      </div>

      <div className="demo-card__actions">
        <Link to={route} className="demo-card__btn demo-card__btn--primary">
          Demo en vivo ↗
        </Link>
        <a
          href={codeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="demo-card__btn demo-card__btn--secondary"
        >
          Ver código →
        </a>
      </div>
    </article>
  );
};

export default ProjectCard;
