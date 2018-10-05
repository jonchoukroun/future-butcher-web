export default function(){
  this.transition(
    this.hasClass('notification'),
    this.toValue(true),
    this.use('toRight'),
    this.reverse('toRight')
  );

  this.transition(
    this.hasClass('error-message'),
    this.toValue(true),
    this.use('toRight'),
    this.reverse('toRight')
  )

  this.transition(
    this.hasClass('pinned-message'),
    this.toValue(true),
    this.use('toRight'),
    this.reverse('toRight')
  )
}
