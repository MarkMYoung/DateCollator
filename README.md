# DateCollator
Date collation by specified date parts for granular comparison.

## Description
`DateCollator` is like `Intl.Collator`, except it allows for the comparison of `Date`s by (most of) the date part types specified by [`Intl.DateTimeFormat.prototype.formatToParts()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/formatToParts).  The configuration options are similar to some of `Intl.Collator`'s options:

`dateSensitivity`: The granularity and order of date parts to use with each comparison, default `["year", "month", "day", "hour", "minute", "second", "fractionalSecond"]`.  Possible values are an array of:
* `"era"`
* `"year"`
* `"month"`
* `"weekday"`
* `"day"`
* `"dayPeriod"`
* `"hour"`
* `"minute"`
* `"second"`
* `"fractionalSecond"`

`dateUsage`: Whether the comparison is to be performed using local or UTC values, default `"local"`.  Possible values are:
* `"local"` Use `Date.prototype` functions like `getMinutes()`.
* `"utc"` Use `Date.prototype` functions like `getUTCMinutes()`.

## Importing
	import DateCollator from 'datecollator';

—OR—

	import {DateCollator} from 'datecollator';

## Examples
Check whether Dates occur during the same day.

	const dateCollatorDownToDay = new DateCollator( null, {dateSensitivity:['year', 'month', 'day']});
	dateCollatorDownToDay.compare( new Date( 2020, 2, 23, 9, 0 ), new Date( 2020, 2, 23, 17, 0 ));
	// returns 0

Check whether Dates occur during the time (hour and minute) of any day.

	const dateCollatorJustByTime = new DateCollator( null, {dateSensitivity:['hour', 'minute'], dateUsage:'utc'});
	dateCollatorJustByTime.compare( new Date( 2020, 2, 23, 11, 0 ), new Date( 2026, 2, 23, 11, 0 ));
	// returns 0

Check whether Dates occur during the same "dayPeriod" (meridian) of any day.

	const dateCollatorDownToDayPeriod = new DateCollator( null, {dateSensitivity:['dayPeriod']});
	dateCollatorDownToDayPeriod.compare( new Date( 2020, 2, 23, 9, 0 ), new Date( 2026, 2, 23, 11, 0 ));
	// returns 0

Check whether Dates occur during the same "weekday" of any week.

	const dateCollatorJustByWeekday = new DateCollator( null, {dateSensitivity:['weekday'], dateUsage:'utc'});
	dateCollatorJustByWeekday.compare( new Date( 2020, 2, 23, 9, 0 ), new Date( 2026, 2, 23, 11, 0 ));
	// returns 0

Default collator for sorting.

	const dateCollator = new DateCollator();
	let dates =
	[
		new Date( 2020, 2, 23, 17, 0 ),
		new Date( 2020, 2, 23, 11, 0 ),
		new Date( 2020, 2, 23, 9, 0 ),
		new Date( 2026, 2, 23, 11, 0 )
	];
	dates.sort( dateCollator.compare ).map(( date ) => date.toISOString());
	// returns
	// [
	//	"2020-03-23T14:00:00.000Z",
	//	"2020-03-23T16:00:00.000Z",
	//	"2020-03-23T22:00:00.000Z",
	//	"2026-03-23T16:00:00.000Z"
	// ]
