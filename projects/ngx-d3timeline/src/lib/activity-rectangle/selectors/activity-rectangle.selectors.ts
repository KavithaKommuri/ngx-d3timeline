import { createSelector } from '../../store-lib/selector/create-selector';
import { selectDragEvent } from '../../store/state';
import {
  selectNonDraggedActivities,
  selectCurrentlyDraggedActivity,
  selectCurrentlyDraggedActivityWithDraggedToResource
} from '../../activity/activity.selectors';
import {
  createActivityRectangle,
  getMinBreadthToShowTitle,
  getShowTitle,
  getActivityTitleBreadthInTimeAxis
} from '../../content/content-utils';
import {
  getDragEventOffset,
  getDragEventOffsetTime
} from '../../drag/drag-utils';
import { MemoizedSelector } from '../../store-lib/selector/memoized-selector';
import { PositionedActivity } from '../../activity/positioned-activity';
import { ActivityRectangle } from '../activity-rectangle';
import { Point } from '../../core/point';
import { selectTransform } from './activity-rectangle-position.selectors';
import {
  selectRectWidth,
  selectRectHeight,
  selectRectBreadthInTimeAxis
} from './activity-rectangle-size.selectors';
import {
  selectTimeOrientation,
  selectActivityFontFace,
  selectActivityFontSize
} from '../../options/options.selectors';

const selectActivityTitleBreadthInTimeline = createSelector(
  selectTimeOrientation,
  selectActivityFontFace,
  selectActivityFontSize,
  (timeOrientation, fontFace, fontSize) =>
    getActivityTitleBreadthInTimeAxis.bind(
      null,
      timeOrientation,
      fontFace,
      fontSize
    )
);

const selectMinBreadthToShowLabel = createSelector(
  selectActivityTitleBreadthInTimeline,
  activityTitleBreadthInTimeline =>
    getMinBreadthToShowTitle.bind(null, activityTitleBreadthInTimeline)
);

const selectShowTitle = createSelector(
  selectRectBreadthInTimeAxis,
  selectMinBreadthToShowLabel,
  (rectBreadthInTimeAxis, minBreadthToShowLabel) =>
    getShowTitle.bind(null, rectBreadthInTimeAxis, minBreadthToShowLabel)
);

const selectDragEventOffset = createSelector(
  selectDragEvent,
  getDragEventOffset
);

const selectDragEventOffsetTime = createSelector(
  selectDragEvent,
  selectTimeOrientation,
  getDragEventOffsetTime
);

const selectRectangle = (selectOffset?: MemoizedSelector<Point>) =>
  createSelector(
    selectTransform(selectOffset),
    selectRectWidth,
    selectRectHeight,
    selectActivityFontFace,
    selectActivityFontSize,
    selectShowTitle,
    (transform, width, height, fontFace, fontSize, showTitle) =>
      createActivityRectangle.bind(
        null,
        transform,
        width,
        height,
        fontFace,
        fontSize,
        showTitle
      )
  );

export const selectNonDraggedActivityRectangles = createSelector(
  selectNonDraggedActivities,
  selectRectangle(),
  (activities, positionedActivityToRectangle) =>
    activities.map(activity => positionedActivityToRectangle(activity))
);

export const selectDraggingActivityRectangle = createSelector(
  selectCurrentlyDraggedActivity,
  selectRectangle(selectDragEventOffset),
  activityToRectangle
);

export const selectDraggedFromRectangle = createSelector(
  selectCurrentlyDraggedActivity,
  selectRectangle(),
  activityToRectangle
);

export const selectDraggedToRectangle = createSelector(
  selectCurrentlyDraggedActivityWithDraggedToResource,
  selectRectangle(selectDragEventOffsetTime),
  activityToRectangle
);

function activityToRectangle(
  activity: PositionedActivity,
  getActivityRectangle: (a: PositionedActivity) => ActivityRectangle
) {
  return activity && getActivityRectangle(activity);
}
