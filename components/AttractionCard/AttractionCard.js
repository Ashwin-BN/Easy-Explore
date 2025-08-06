import styles from './AttractionCard.module.css';
import Image from 'next/image';

export default function AttractionCard({ attraction, onHover, onLeave, onExpand, actions }) {
    return (
        <div
            className={styles.card}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            onClick={() => onExpand?.(attraction)}

        >
            {attraction.image && (
                <div className={styles.imageWrapper}>
                    <Image
                        src={attraction.image}
                        alt={attraction.name || 'Attraction image'}
                        width={100}
                        height={100}
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            )}

            <div className={styles.info}>
                <h3>{attraction.name || 'Unnamed Place'}</h3>
                <p className={styles.address}>{attraction.address || 'Address not available'}</p>
                {attraction.summary && (
                    <p className={styles.summary}>
                        {attraction.summary.length > 100
                            ? attraction.summary.slice(0, 100) + '...'
                            : attraction.summary}
                    </p>
                )}
                {attraction.rating != null && <p>Rating: {attraction.rating}</p>}
                {actions && <div className={styles.actions}>{actions}</div>}
            </div>
        </div>
    );
}