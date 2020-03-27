//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
/**
 * @summary Date collation by specified date parts for granular comparison.
 * @description This collator is similar to `Intl.Collator` except it allows 
 *	for the comparison of `Date`s by (most of) the date part types specified by 
 *	[`Intl.DateTimeFormat.prototype.formatToParts()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/formatToParts).  
 *	The configuration options are similar to some of `Intl.Collator`'s options.
 * @example <caption>Check whether Dates occur during the same day.</caption>
 *	const dateCollatorDownToDay = new DateCollator( null, {dateSensitivity:['year', 'month', 'day']});
 *	dateCollatorDownToDay.compare( new Date( 2020, 2, 23, 9, 0 ), new Date( 2020, 2, 23, 17, 0 ));
 *	// returns 0
 * @example <caption>Check whether Dates occur during the time (hour and minute) of any day.</caption>
 *	const dateCollatorJustByTime = new DateCollator( null, {dateSensitivity:['hour', 'minute'], dateUsage:'utc'});
 *	dateCollatorJustByTime.compare( new Date( 2020, 2, 23, 11, 0 ), new Date( 2026, 2, 23, 11, 0 ));
 *	// returns 0
 * @example <caption>Check whether Dates occur during the same "dayPeriod" (meridian) of any day.</caption>
 *	const dateCollatorDownToDayPeriod = new DateCollator( null, {dateSensitivity:['dayPeriod']});
 *	dateCollatorDownToDayPeriod.compare( new Date( 2020, 2, 23, 9, 0 ), new Date( 2026, 2, 23, 11, 0 ));
 *	// returns 0
 * @example <caption>Check whether Dates occur during the same "weekday" of any week.</caption>
 *	const dateCollatorJustByWeekday = new DateCollator( null, {dateSensitivity:['weekday'], dateUsage:'utc'});
 *	dateCollatorJustByWeekday.compare( new Date( 2020, 2, 23, 9, 0 ), new Date( 2026, 2, 23, 11, 0 ));
 *	// returns 0
 * @example <caption>Default collator for sorting.</caption>
 *	const dateCollator = new DateCollator();
 *	let dates =
 *	[
 *		new Date( 2020, 2, 23, 17, 0 ),
 *		new Date( 2020, 2, 23, 11, 0 ),
 *		new Date( 2020, 2, 23, 9, 0 ),
 *		new Date( 2026, 2, 23, 11, 0 )
 *	];
 *	dates.sort( dateCollator.compare ).map(( date ) => date.toISOString());
 *	// returns
 *	// [
 *	//	"2020-03-23T14:00:00.000Z",
 *	//	"2020-03-23T16:00:00.000Z",
 *	//	"2020-03-23T22:00:00.000Z",
 *	//	"2026-03-23T16:00:00.000Z"
 *	// ]
 * @version 2.0.0 (2020-03-01)
 *	1.0.0 (2020-02-23)
 * @author Mark M. Young
 */
class DateCollator
{
	/**
	 * @param {string|string[]} [_locales] - Unused, but present to be congruent with other collators.
	 * @param {object} [options] - An object with some or all of the following properties:
	 * @param {DatePartEnum[]} [options.dateSensitivity=['year', 'month', 'day', 'hour', 'minute', 'second', 'fractionalSecond']] - The granularity and order of date parts to use with each comparison.
	 * @param {DateUsageEnum} [options.dateUsage='local'] - Whether the comparison is to be performed using local or UTC values.
	 * @typedef {('era'|'year'|'month'|'weekday'|'day'|'dayPeriod'|'hour'|'minute'|'second'|'fractionalSecond')} DatePartEnum
	 * @typedef {('local'|'utc')} DateUsageEnum
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/formatToParts
	 */
	constructor( _locales, options )
	{
		Object.defineProperties( this, {hidden:{enumerable:false, value:
		{
			options,
		}}});
		this.hidden.options = this.hidden.options || {};
		this.hidden.options.dateSensitivity = this.hidden.options.dateSensitivity
			|| ['year', 'month', 'day', 'hour', 'minute', 'second', 'fractionalSecond'];
		this.hidden.options.dateUsage = this.hidden.options.dateUsage
			|| 'local';
		if( !Array.isArray( this.hidden.options.dateSensitivity ))
		{throw( new TypeError( `DateCollator options property 'dateSensitivity' must be an array.` ));}
		else if( this.hidden.options.dateSensitivity
			.some(( eachDateSensitivity, _s, _everyDateSensitivity ) =>
				!Object.values( DateCollator.DateSensitivity ).includes( eachDateSensitivity )
			)
		)
		{throw( new RangeError( `Value '${eachDateSensitivity}' out of range for DateCollator options property 'dateSensitivity'.` ));}
		if( !(Object.values( DateCollator.DateUsage ).includes( this.hidden.options.dateUsage )))
		{throw( new RangeError( `Value '${this.hidden.options.dateUsage}' out of range for DateCollator options property 'dateUsage'.` ));}
	}
	static get DateSensitivity()
	{
		return(
		{
			Era:'era', Year:'year', Month:'month', Weekday:'weekday',
			Day:'day', DayPeriod:'dayPeriod', Hour:'hour', Minute:'minute',
			Second:'second', FractionalSecond:'fractionalSecond'
		});
	}
	static get DateUsage()
	{return({Local:'local', UTC:'utc'});}
	/**
	 * @summary Calculates a negative, zero, or positive number indicating that 
	 *	`leftDate` is less than, equal to, or greater than `rightDate`, respectively.
	 * @description Numeric representation of how `leftDate` and `rightDate` 
	 *	compare to each other according to the sort order of this `Collator` object: 
	 *	a negative value if `leftDate` comes before `rightDate`; 
	 *	a positive value if `leftDate` comes after `rightDate`; 
	 *	0 if they are considered equal.
	 * @returns {number} Comparison of `leftDate` with respect to `rightDate`.
	 * @param {Date|*} leftDate 
	 * @param {Date|*} rightDate 
	 */
	get compare()
	{
		// Accessed by `this.compare`, which `bind`s it to `this` for passing `compare` as an unscoped parameter.
		function compareUnbound( leftDate, rightDate )
		{
			/**
			 * @returns {number} Zero if all `partPair` comparisons are equal or 
			 *	non-zero indicating the first non-zero result.
			 * @param {number} difference - Comparison of each `partPair` in order.
			 * @param {number[]} partPair - Each sequential pair of date parts.
			 * Note: Will not be accurate with `Array.prototype.reduceRight`.
			 */
			const datePartReducer = ( difference, partPair, _pp, _partPairs ) =>
			{
				// istanbul ignore next
				if( !(typeof( difference ) === 'number' || difference instanceof Number))
				{throw( new TypeError( `Initial value must be a number (or Number).` ));}
				// istanbul ignore next
				// if( partPair.length != 2 )
				// {throw( new TypeError( `Array should consist only of arrays with length 2.` ));}
				// istanbul ignore next
				// if( !partPair.every(( part, _p, _parts ) => Number.isFinite( part )))
				// {throw( new TypeError( `Array should consist only of arrays of numbers.` ));}
				// Do no recalculate the difference if a non-zero difference has already been calculated.
				if( difference == 0 )
				{difference = partPair[ 0 ] - partPair[ 1 ];}
				return( difference );
			};
			let difference;
			const areBothValidDates = leftDate instanceof Date && rightDate instanceof Date
				&& !Number.isNaN( leftDate.getTime()) && !Number.isNaN( rightDate.getTime());
			if( areBothValidDates )
			{
				const partPairs = this.hidden.options.dateSensitivity
				.map(( eachDateSensitivity, _s, _everyDateSensitivity ) =>
				{
					let partPair;
					switch( this.hidden.options.dateUsage )
					{
						case 'local':
							switch( eachDateSensitivity )
							{
								case 'day':
									partPair = [leftDate.getDate(), rightDate.getDate()];
									break;
								case 'dayPeriod':
									// Transform a.m. to 0 and p.m. to 1.
									partPair = [Math.floor( leftDate.getHours() / 12 ), Math.floor( rightDate.getHours() / 12 )];
									break;
								case 'era':
									// Transform B.C. to -1 and A.D. to +1.
									partPair = [Math.sign( leftDate.getFullYear()), Math.sign( rightDate.getFullYear())];
									break;
								case 'hour':
									partPair = [leftDate.getHours(), rightDate.getHours()];
									break;
								case 'minute':
									partPair = [leftDate.getMinutes(), rightDate.getMinutes()];
									break;
								case 'second':
									partPair = [leftDate.getSeconds(), rightDate.getSeconds()];
									break;
								case 'month':
									partPair = [leftDate.getMonth(), rightDate.getMonth()];
									break;
								case 'weekday':
									partPair = [leftDate.getDay(), rightDate.getDay()];
									break;
								case 'year':
									partPair = [leftDate.getFullYear(), rightDate.getFullYear()];
									break;
								case 'fractionalSecond':
									// Note: This is valid for as long as `Date`'s epoch/`getTime()` value is in milliseconds.
									partPair = [leftDate.getMilliseconds(), rightDate.getMilliseconds()];
									break;
								default:
									// istanbul ignore next
									throw( new Error( `Unhandled 'dateSensitivity' value '${eachDateSensitivity}'.` ));
							}
							break;
						case 'utc':
							switch( eachDateSensitivity )
							{
								case 'day':
									partPair = [leftDate.getUTCDate(), rightDate.getUTCDate()];
									break;
								case 'dayPeriod':
									// Transform a.m. to 0 and p.m. to 1.
									partPair = [Math.floor( leftDate.getUTCHours() / 12 ), Math.floor( rightDate.getUTCHours() / 12 )];
									break;
								case 'era':
									// Transform B.C. to -1 and A.D. to +1.
									partPair = [Math.sign( leftDate.getUTCFullYear()), Math.sign( rightDate.getUTCFullYear())];
									break;
								case 'hour':
									partPair = [leftDate.getUTCHours(), rightDate.getUTCHours()];
									break;
								case 'minute':
									partPair = [leftDate.getUTCMinutes(), rightDate.getUTCMinutes()];
									break;
								case 'second':
									partPair = [leftDate.getUTCSeconds(), rightDate.getUTCSeconds()];
									break;
								case 'month':
									partPair = [leftDate.getUTCMonth(), rightDate.getUTCMonth()];
									break;
								case 'weekday':
									partPair = [leftDate.getUTCDay(), rightDate.getUTCDay()];
									break;
								case 'year':
									partPair = [leftDate.getUTCFullYear(), rightDate.getUTCFullYear()];
									break;
								case 'fractionalSecond':
									// Note: This is valid for as long as `Date`'s epoch/`getTime()` value is in milliseconds.
									partPair = [leftDate.getUTCMilliseconds(), rightDate.getUTCMilliseconds()];
									break;
								default:
									// istanbul ignore next
									throw( new Error( `Unhandled 'dateSensitivity' value '${eachDateSensitivity}'.` ));
							}
							break;
						default:
							// istanbul ignore next
							throw( new Error( `Unhandled 'dateUsage' value '${this.options.dateUsage}'.` ));
					}
					return( partPair );
				}, this );
				difference = partPairs.reduce( datePartReducer, 0 );
			}
			else
			{
				const leftString = String( leftDate );
				const rightString = String( rightDate );
				difference = leftString < rightString?-1
					:leftString > rightString?+1
					:0;
			}
			// Clamp the (integer) result to [-1, +1].
			return( Math.min( Math.max( -1, difference ), +1 ));
		};
		// Cannot be used with functions like `Array.prototype.sort` without binding.
		return( compareUnbound.bind( this ));
	}
}
export {DateCollator};
export default DateCollator;
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//