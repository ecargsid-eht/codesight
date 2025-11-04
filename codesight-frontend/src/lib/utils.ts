export const getDifficultyBadge = (diff:string | undefined) => {
    switch(diff?.toLowerCase()){
        case 'easy':
            return 'badge-success';
        case 'medium':
            return 'badge-warning';
        case 'hard':
            return 'badge-error';
        default:
            return 'badge-ghost';
    }
}